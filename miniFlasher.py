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
PORT = 5001

# Librerías requeridas
REQUIRED_LIBRARIES = {
    "Adafruit_NeoPixel.h": "Adafruit NeoPixel",
    "ESP32Servo.h": "ESP32Servo",
    "BluetoothSerial.h": "BluetoothSerial",
    "Adafruit_PWMServoDriver.h": "Adafruit PWM Servo Driver Library",
    "Adafruit_TCS34725.h": "Adafruit TCS34725"
}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global variables for serial thread
serial_thread = None
stop_serial_event = threading.Event()
current_serial_port = None
global_ser = None # Variable global para permitir escritura desde la web
lock_serial = threading.Lock()

def detect_esp32_port():
    try:
        ports = serial.tools.list_ports.comports()
        for port in ports:
            if (port.vid == 0x10C4 and port.pid == 0xEA60) or \
               (port.vid == 0x1A86 and port.pid == 0x7523):
                return port.device
        for port in ports:
            if 'CP210' in port.description or 'CH340' in port.description or 'USB-SERIAL' in port.description:
                return port.device
    except Exception as e:
        print(f"⚠️ Error detectando puerto: {e}")
    return None

def check_and_install_libraries(code):
    """Busca qué librerías usa el código y las instala si faltan"""
    for header, lib_name in REQUIRED_LIBRARIES.items():
        if f"<{header}>" in code or f'"{header}"' in code:
            print(f"📦 Verificando/Instalando librería: {lib_name}...")
            subprocess.run([ARDUINO_CLI, 'lib', 'install', lib_name], capture_output=True)

def serial_monitor_loop():
    global current_serial_port, global_ser
    print("🧵 Monitor Serial iniciado")
    
    while not stop_serial_event.is_set():
        try:
            port = detect_esp32_port()
            if port:
                if current_serial_port != port:
                    print(f"🔌 Monitor Serial conectando a: {port}")
                    current_serial_port = port
                
                try:
                    with serial.Serial(port, 115200, timeout=0.1) as ser:
                        global_ser = ser # Guardar referencia para poder escribir
                        ser.reset_input_buffer()
                        
                        while not stop_serial_event.is_set():
                            if ser.in_waiting > 0:
                                try:
                                    line = ser.readline().decode('utf-8', errors='replace').strip()
                                    if line:
                                        socketio.emit('serial_data', {'data': line})
                                except Exception as e:
                                    pass
                            else:
                                time.sleep(0.05)
                        
                        global_ser = None
                        print("🛑 Cerrando puerto serial para flashear...")

                except serial.SerialException:
                    current_serial_port = None
                    global_ser = None
                    time.sleep(1)
            else:
                current_serial_port = None
                global_ser = None
                time.sleep(1)
                
        except Exception:
            time.sleep(1)

def compile_code(user_code, sketch_name):
    try:
        check_and_install_libraries(user_code) # Instalar librerías antes de compilar
        
        sketch_dir = os.path.join(TEMP_DIR, sketch_name)
        os.makedirs(sketch_dir, exist_ok=True)
        sketch_file = os.path.join(sketch_dir, f'{sketch_name}.ino')
        
        with open(sketch_file, 'w', encoding='utf-8') as f:
            f.write(user_code)
        
        print("🔧 Compilando...")
        compile_cmd = [ARDUINO_CLI, 'compile', '--fqbn', BOARD_FQBN, '--output-dir', sketch_dir, sketch_file]
        result = subprocess.run(compile_cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode != 0:
            shutil.rmtree(sketch_dir, ignore_errors=True)
            return None, result.stderr
        
        print("✅ Compilación exitosa")
        bin_file = os.path.join(sketch_dir, f'{sketch_name}.ino.bin')
        return bin_file, sketch_dir
        
    except Exception as e:
        return None, str(e)

def flash_esp32(bin_file, port):
    try:
        print(f"📤 Subiendo a {port}...")
        sketch_dir = os.path.dirname(bin_file)
        upload_cmd = [ARDUINO_CLI, 'upload', '-p', port, '--fqbn', BOARD_FQBN, '--input-dir', sketch_dir]
        result = subprocess.run(upload_cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode != 0:
            err_msg = result.stderr if result.stderr else result.stdout
            return False, err_msg
        
        print("✅ Flasheado exitoso")
        return True, "Código subido exitosamente"
        
    except Exception as e:
        return False, str(e)

@app.route('/api/health', methods=['GET'])
def health_check():
    port = detect_esp32_port()
    return jsonify({'status': 'ok', 'esp32_detected': port is not None, 'port': port})

@app.route('/api/flash', methods=['POST'])
def flash_code():
    try:
        global serial_thread
        data = request.json
        user_code = data.get('code', '')
        
        if not user_code:
            return jsonify({'success': False, 'error': 'No se proporcionó código'}), 400
        
        port = detect_esp32_port()
        if not port:
            return jsonify({'success': False, 'error': 'No se detectó ESP32.'}), 400
        
        sketch_name = f'robot_sketch_{time.time_ns()}'
        bin_file, sketch_dir_or_error = compile_code(user_code, sketch_name)
        
        if not bin_file:
            return jsonify({'success': False, 'error': f'Error compilación: {sketch_dir_or_error}'}), 400
        
        stop_serial_event.set()
        if serial_thread and serial_thread.is_alive():
            serial_thread.join(timeout=3)
        time.sleep(0.5) 
        
        success, message = False, ""
        try:
            success, message = flash_esp32(bin_file, port)
        finally:
            stop_serial_event.clear()
            serial_thread = threading.Thread(target=serial_monitor_loop)
            serial_thread.daemon = True
            serial_thread.start()
        
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
        return jsonify({'success': False, 'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print('👤 Cliente web conectado')

@socketio.on('serial_write')
def handle_serial_write(data):
    # ¡Ahora sí escribimos los comandos de los deslizadores al ESP32!
    global global_ser
    msg = data.get('data', '')
    if global_ser and global_ser.is_open and msg:
        try:
            comando = (msg + '\n').encode('utf-8')
            global_ser.write(comando)
            print(f"📡 Comando enviado al robot: {msg}")
        except Exception as e:
            print(f"⚠️ Error enviando comando: {e}")

if __name__ == '__main__':
    print("="*60)
    print("🤖 MINI FLASHER ESP32 - Listo para Servos PCA y Sensores")
    print("="*60)
    
    stop_serial_event.clear()
    serial_thread = threading.Thread(target=serial_monitor_loop)
    serial_thread.daemon = True
    serial_thread.start()

    try:
        socketio.run(app, host='0.0.0.0', port=PORT, debug=False, allow_unsafe_werkzeug=True)
    finally:
        stop_serial_event.set()