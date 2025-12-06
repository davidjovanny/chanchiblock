"""
miniFlasher.py - Mini servidor local para compilar y flashear ESP32
Corre en background en cada PC estudiante (puerto 5001)
Compatible con el app.js del modelo híbrido.
"""

import subprocess
import os
import tempfile
import shutil
import time
import threading
import serial
import serial.tools.list_ports
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

# Configuración
ARDUINO_CLI = "arduino-cli"
BOARD_FQBN = "esp32:esp32:esp32"
TEMP_DIR = tempfile.gettempdir()
PORT = 5001  # Puerto para el servidor local

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global variables for serial thread
serial_thread = None
stop_serial_event = threading.Event()
current_serial_port = None
lock_serial = threading.Lock() # Lock para evitar conflictos de acceso

def detect_esp32_port():
    """Detecta automáticamente el puerto COM del ESP32 (usando pyserial)"""
    try:
        ports = serial.tools.list_ports.comports()
        for port in ports:
            # Buscar por VID/PID de los chips comunes de ESP32
            # CP210x: (0x10C4, 0xEA60)
            # CH340:  (0x1A86, 0x7523)
            if (port.vid == 0x10C4 and port.pid == 0xEA60) or \
               (port.vid == 0x1A86 and port.pid == 0x7523):
                return port.device
        
        # Si no se encuentra por VID/PID, buscar por descripción
        for port in ports:
            if 'CP210' in port.description or \
               'CH340' in port.description or \
               'USB-SERIAL' in port.description:
                return port.device

    except Exception as e:
        print(f"⚠️ Error detectando puerto: {e}")
    
    return None

def serial_monitor_loop():
    """Background thread to read from serial port"""
    global current_serial_port
    print("🧵 Serial monitor thread started")
    
    while not stop_serial_event.is_set():
        try:
            port = detect_esp32_port()
            if port:
                # Si el puerto cambió o perdimos conexión, notificamos
                if current_serial_port != port:
                    print(f"🔌 Monitor Serial conectando a: {port}")
                    current_serial_port = port
                
                try:
                    # Timeout bajo (0.1) para revisar stop_serial_event frecuentemente
                    with serial.Serial(port, 115200, timeout=0.1) as ser:
                        # print(f"✅ Puerto abierto: {port}")
                        ser.reset_input_buffer()
                        
                        while not stop_serial_event.is_set():
                            if ser.in_waiting > 0:
                                try:
                                    # Leer línea
                                    line = ser.readline().decode('utf-8', errors='replace').strip()
                                    if line:
                                        socketio.emit('serial_data', {'data': line})
                                except Exception as e:
                                    print(f"⚠️ Error leyendo línea: {e}")
                            else:
                                # Pequeña pausa para no saturar CPU
                                time.sleep(0.05)
                        
                        # Al salir del while interno (stop set), el 'with' cierra el puerto automáticamente
                        print("🛑 Cerrando puerto serial para liberar recurso...")

                except serial.SerialException:
                    # El puerto probablemente se desconectó o está ocupado
                    current_serial_port = None
                    time.sleep(1)
                except Exception as e:
                    print(f"⚠️ Error conexión serial: {e}")
                    time.sleep(1)
            else:
                current_serial_port = None
                time.sleep(1)
                
        except Exception as e:
            print(f"⚠️ Error en loop monitor: {e}")
            time.sleep(1)

    print("🧵 Serial monitor thread stopped")

def compile_code(user_code, sketch_name):
    """Compila el código Arduino y devuelve el path del .bin"""
    try:
        sketch_dir = os.path.join(TEMP_DIR, sketch_name)
        os.makedirs(sketch_dir, exist_ok=True)
        sketch_file = os.path.join(sketch_dir, f'{sketch_name}.ino')
        
        with open(sketch_file, 'w', encoding='utf-8') as f:
            f.write(user_code)
        
        print(f"📝 Sketch guardado: {sketch_file}")
        print("🔧 Compilando...")
        
        compile_cmd = [
            ARDUINO_CLI, 'compile',
            '--fqbn', BOARD_FQBN,
            '--output-dir', sketch_dir,
            sketch_file
        ]
        
        # Windows: creationflags para que no salte ventana cmd pop-up si se usara pyinstaller
        result = subprocess.run(
            compile_cmd,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode != 0:
            print(f"❌ Error compilación: {result.stderr}")
            shutil.rmtree(sketch_dir, ignore_errors=True)
            return None, result.stderr
        
        print("✅ Compilación exitosa")
        bin_file = os.path.join(sketch_dir, f'{sketch_name}.ino.bin')
        
        if not os.path.exists(bin_file):
            return None, "No se generó el archivo binario"
        
        return bin_file, sketch_dir
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None, str(e)

def flash_esp32(bin_file, port):
    """Flashea el ESP32 usando arduino-cli upload"""
    try:
        print(f"📤 Flasheando a {port} usando arduino-cli...")
        sketch_dir = os.path.dirname(bin_file)
        
        upload_cmd = [
            ARDUINO_CLI, 'upload',
            '-p', port,
            '--fqbn', BOARD_FQBN,
            '--input-dir', sketch_dir
        ]
        
        result = subprocess.run(
            upload_cmd,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode != 0:
            # Fallback a stdout si stderr está vacío
            err_msg = result.stderr if result.stderr else result.stdout
            print(f"❌ Error flasheando: {err_msg}")
            return False, err_msg
        
        print("✅ Flasheado exitoso")
        return True, "Código subido exitosamente"
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False, str(e)

# ===== ENDPOINTS =====

@app.route('/api/health', methods=['GET'])
def health_check():
    port = detect_esp32_port()
    return jsonify({
        'status': 'ok',
        'esp32_detected': port is not None,
        'port': port
    })

@app.route('/api/flash', methods=['POST'])
def flash_code():
    try:
        global serial_thread
        
        data = request.json
        user_code = data.get('code', '')
        
        if not user_code:
            return jsonify({'success': False, 'error': 'No se proporcionó código'}), 400
        
        print("\n" + "="*50)
        print("📥 Nueva solicitud de flash")
        print("="*50)
        
        port = detect_esp32_port()
        if not port:
            return jsonify({'success': False, 'error': 'No se detectó ESP32.'}), 400
        
        print(f"🔌 Puerto destino: {port}")
        
        # 1. Compilar (NO requiere detener serial todavía)
        sketch_name = f'robot_sketch_{time.time_ns()}'
        bin_file, sketch_dir_or_error = compile_code(user_code, sketch_name)
        
        if not bin_file:
            return jsonify({'success': False, 'error': f'Error compilación: {sketch_dir_or_error}'}), 400
        
        # 2. Detener monitor serial CRÍTICO
        print("⏳ Liberando puerto serial...")
        stop_serial_event.set() # Señal de pare
        
        if serial_thread and serial_thread.is_alive():
            serial_thread.join(timeout=3) # Esperar a que muera
            if serial_thread.is_alive():
                print("⚠️ ADVERTENCIA: El hilo serial no murió a tiempo. Puede fallar el upload.")
            else:
                print("✅ Puerto liberado correctamente.")
        
        # PAUSA TÉCNICA: Dar tiempo al OS para liberar el handler del archivo
        time.sleep(0.5) 
        
        # 3. Flashear
        success = False
        message = ""
        try:
            success, message = flash_esp32(bin_file, port)
        finally:
            # 4. Reiniciar monitor serial SIEMPRE
            print("🔄 Reactivando monitor serial...")
            stop_serial_event.clear() # Limpiar bandera para permitir loop
            serial_thread = threading.Thread(target=serial_monitor_loop)
            serial_thread.daemon = True
            serial_thread.start()
        
        # Limpieza
        try:
            if isinstance(sketch_dir_or_error, str) and os.path.exists(sketch_dir_or_error):
                shutil.rmtree(sketch_dir_or_error, ignore_errors=True)
        except:
            pass
        
        if success:
            return jsonify({'success': True, 'message': message, 'port': port})
        else:
            return jsonify({'success': False, 'error': message}), 400
            
    except Exception as e:
        print(f"❌ Error interno: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print('👤 Cliente conectado a WebSockets')

@socketio.on('serial_write')
def handle_serial_write(data):
    # Función extra: permitir escribir al serial desde la web
    global current_serial_port
    msg = data.get('data', '')
    if current_serial_port and msg:
        try:
            # Abrir momentáneamente para escribir (si el hilo de lectura no lo tiene bloqueado)
            # Nota: Esto es complejo si el hilo de lectura tiene el puerto abierto.
            # Idealmente, el hilo de lectura debería gestionar la escritura también.
            # Por simplicidad en este diseño, omitimos escritura compleja concurrente.
            pass 
        except:
            pass

if __name__ == '__main__':
    print("="*60)
    print("🤖 MINI FLASHER ESP32 - Servidor Local Mejorado")
    print("="*60)
    print(f"✅ Iniciado en: http://localhost:{PORT}")
    
    # Iniciar hilo de monitoreo al arranque
    stop_serial_event.clear()
    serial_thread = threading.Thread(target=serial_monitor_loop)
    serial_thread.daemon = True
    serial_thread.start()

    try:
        socketio.run(app, host='0.0.0.0', port=PORT, debug=False, allow_unsafe_werkzeug=True)
    finally:
        stop_serial_event.set()