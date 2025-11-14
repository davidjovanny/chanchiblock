// Generadores de cÃ³digo Arduino/C++ para cada bloque

// ===== GENERADORES DE MOVIMIENTO =====

Blockly.JavaScript['robot_forward'] = function(block) {
    return 'avanzar();\n';
};

Blockly.JavaScript['robot_backward'] = function(block) {
    return 'retroceder();\n';
};

Blockly.JavaScript['robot_turn_left'] = function(block) {
    return 'girarIzquierda();\n';
};

Blockly.JavaScript['robot_turn_right'] = function(block) {
    return 'girarDerecha();\n';
};

Blockly.JavaScript['robot_stop'] = function(block) {
    return 'detener();\n';
};

// ===== GENERADOR DE DELAY =====

Blockly.JavaScript['robot_delay'] = function(block) {
    const time = block.getFieldValue('TIME');
    return `delay(${time});\n`;
};

// ===== GENERADORES DE SENSORES =====

Blockly.JavaScript['robot_read_distance'] = function(block) {
    return ['leerDistancia()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['robot_if_distance'] = function(block) {
    const distance = block.getFieldValue('DISTANCE');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `long distancia = leerDistancia();\nif (distancia < ${distance}) {\n${statements}}\n`;
};

// ===== GENERADOR DE SERVO =====

Blockly.JavaScript['robot_servo'] = function(block) {
    const angle = block.getFieldValue('ANGLE');
    return `servo1.write(${angle});\n`;
};

// ===== GENERADORES GPIO =====

Blockly.JavaScript['gpio_pin_mode'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    return `pinMode(${pin}, ${mode});\n`;
};

Blockly.JavaScript['gpio_digital_write'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `digitalWrite(${pin}, ${state});\n`;
};

Blockly.JavaScript['gpio_digital_read'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return [`digitalRead(${pin})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['gpio_analog_read'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(${pin})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['gpio_analog_write'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `analogWrite(${pin}, ${value});\n`;
};

// ===== GENERADORES SERIAL =====

Blockly.JavaScript['serial_begin'] = function(block) {
    const baud = block.getFieldValue('BAUD');
    return `Serial.begin(${baud});\n`;
};

Blockly.JavaScript['serial_print'] = function(block) {
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `Serial.println(${text});\n`;
};

// ===== GENERADORES WIFI =====

Blockly.JavaScript['wifi_connect'] = function(block) {
    const ssid = block.getFieldValue('SSID');
    const pass = block.getFieldValue('PASS');
    return `WiFi.begin("${ssid}", "${pass}");\nwhile (WiFi.status() != WL_CONNECTED) {\n  delay(500);\n  Serial.print(".");\n}\nSerial.println("\\nWiFi conectado!");\nSerial.print("IP: ");\nSerial.println(WiFi.localIP());\n`;
};

// ===== GENERADORES BLUETOOTH =====

Blockly.JavaScript['bt_begin'] = function(block) {
    const name = block.getFieldValue('NAME');
    return `SerialBT.begin("${name}");\nSerial.println("Bluetooth iniciado: ${name}");\n`;
};

Blockly.JavaScript['bt_print'] = function(block) {
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `SerialBT.println(${text});\n`;
};

// ===== GENERADOR LED INTERNO =====

Blockly.JavaScript['test_builtin_led'] = function(block) {
    return `digitalWrite(${ESP32_BUILTIN_LED}, HIGH);\ndelay(500);\ndigitalWrite(${ESP32_BUILTIN_LED}, LOW);\ndelay(500);\n`;
};

// ===== GENERADORES DE VARIABLES =====

Blockly.JavaScript['create_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const varType = block.getFieldValue('VAR_TYPE');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `${varType} ${varName} = ${value};\n`;
};

Blockly.JavaScript['set_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `${varName} = ${value};\n`;
};

Blockly.JavaScript['get_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    return [varName, Blockly.JavaScript.ORDER_ATOMIC];
};

// ===== GENERADOR TIMER =====

Blockly.JavaScript['millis_timer'] = function(block) {
    return ['millis()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.provideFunction_(
    'randomInt',
    ['long ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(long min, long max) {',
        '  if (min > max) { long temp = min; min = max; max = temp; }',
        '  return random(min, max + 1);',
        '}'
    ]);

Blockly.JavaScript['math_random_int'] = function(block) {
    var from = block.getFieldValue('FROM') || '1';
    var to = block.getFieldValue('TO') || '100';
    var functionName = Blockly.JavaScript.provideFunction_('randomInt', /* ...código de arriba... */ );
    var code = functionName + '(' + from + ', ' + to + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
// ===== FUNCIÃ“N PRINCIPAL DE GENERACIÃ“N =====
// ===== FUNCIÃ“N PRINCIPAL DE GENERACIÃ“N (MODIFICADA) =====

// ===== FUNCIÓN PRINCIPAL DE GENERACIÓN (CORREGIDA Y OPTIMIZADA) =====
// ===== FUNCIÓN PRINCIPAL DE GENERACIÓN (MODIFICADA) =====

function generateFullCode() {
    const allBlocks = workspace.getAllBlocks(false);

    // Detectar qué librerías necesitamos
    const usesWiFi = allBlocks.some(b => b.type === 'wifi_connect');
    const usesBT = allBlocks.some(b => b.type === 'bt_begin' || b.type === 'bt_print');
    const usesServo = allBlocks.some(b => b.type === 'robot_servo');

    // Header con librerías
    let code = `// Código generado para ESP32 - Robot\n// Generated by Blockly Editor\n\n`;

    if (usesServo) {
        code += `#include <ESP32Servo.h>\n`;
    }
    if (usesWiFi) {
        code += `#include <WiFi.h>\n`;
    }
    if (usesBT) {
        code += `#include <BluetoothSerial.h>\nBluetoothSerial SerialBT;\n`;
    }

    // Configuración de pines
    code += `\n// === CONFIGURACIÓN DE PINES ===\n`;
    code += `#define MOTOR_IZQ_A ${pinConfig.MOTOR_IZQ_A}\n`;
    code += `#define MOTOR_IZQ_B ${pinConfig.MOTOR_IZQ_B}\n`;
    code += `#define MOTOR_DER_A ${pinConfig.MOTOR_DER_A}\n`;
    code += `#define MOTOR_DER_B ${pinConfig.MOTOR_DER_B}\n`;
    code += `#define TRIG_PIN ${pinConfig.TRIG_PIN}\n`;
    code += `#define ECHO_PIN ${pinConfig.ECHO_PIN}\n`;
    code += `#define LINE_LEFT ${pinConfig.LINE_LEFT}\n`;
    code += `#define LINE_RIGHT ${pinConfig.LINE_RIGHT}\n`;
    code += `#define SERVO_PIN ${pinConfig.SERVO_PIN}\n`;
    code += `#define BUILTIN_LED ${ESP32_BUILTIN_LED}\n\n`;

    // Variables globales (definidas por el usuario)
    const varBlocks = allBlocks.filter(b => b.type === 'create_variable');
    if (varBlocks.length > 0) {
        code += `// === VARIABLES GLOBALES ===\n`;
        varBlocks.forEach(block => {
            try {
                // Generamos la definición (p.ej. "int miVar = 10;")
                const blockCode = Blockly.JavaScript.blockToCode(block);
                if (blockCode) code += blockCode;
            } catch (e) {
                console.error('Error generando variable global:', e);
            }
        });
        code += '\n';
    }

    // Objetos
    if (usesServo) {
        code += `// === OBJETOS ===\nServo servo1;\n\n`;
    }

    // Funciones del robot (avanzar, leerDistancia, etc.)
    code += `// === FUNCIONES DEL ROBOT ===\n`;
    code += `void avanzar() {\n  digitalWrite(MOTOR_IZQ_A, HIGH);\n  digitalWrite(MOTOR_IZQ_B, LOW);\n  digitalWrite(MOTOR_DER_A, HIGH);\n  digitalWrite(MOTOR_DER_B, LOW);\n}\n\n`;
    code += `void retroceder() {\n  digitalWrite(MOTOR_IZQ_A, LOW);\n  digitalWrite(MOTOR_IZQ_B, HIGH);\n  digitalWrite(MOTOR_DER_A, LOW);\n  digitalWrite(MOTOR_DER_B, HIGH);\n}\n\n`;
    code += `void girarIzquierda() {\n  digitalWrite(MOTOR_IZQ_A, LOW);\n  digitalWrite(MOTOR_IZQ_B, HIGH);\n  digitalWrite(MOTOR_DER_A, HIGH);\n  digitalWrite(MOTOR_DER_B, LOW);\n}\n\n`;
    code += `void girarDerecha() {\n  digitalWrite(MOTOR_IZQ_A, HIGH);\n  digitalWrite(MOTOR_IZQ_B, LOW);\n  digitalWrite(MOTOR_DER_A, LOW);\n  digitalWrite(MOTOR_DER_B, HIGH);\n}\n\n`;
    code += `void detener() {\n  digitalWrite(MOTOR_IZQ_A, LOW);\n  digitalWrite(MOTOR_IZQ_B, LOW);\n  digitalWrite(MOTOR_DER_A, LOW);\n  digitalWrite(MOTOR_DER_B, LOW);\n}\n\n`;
    code += `long leerDistancia() {\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duracion = pulseIn(ECHO_PIN, HIGH, 30000);\n  if (duracion == 0) return 999;\n  return duracion * 0.034 / 2;\n}\n\n`;

    // Funciones aleatorias (si se usan)
    if (allBlocks.some(b => b.type === 'math_random_int')) {
        code += `long randomInt(long min, long max) {\n  if (min > max) { long temp = min; min = max; max = temp; }\n  return random(min, max + 1);\n}\n\n`;
    }

    // === SETUP ===
    code += `// === SETUP ===\nvoid setup() {\n`;
    // Pin modes fijos (motores, sensores)
    code += `  pinMode(MOTOR_IZQ_A, OUTPUT);\n`;
    code += `  pinMode(MOTOR_IZQ_B, OUTPUT);\n`;
    code += `  pinMode(MOTOR_DER_A, OUTPUT);\n`;
    code += `  pinMode(MOTOR_DER_B, OUTPUT);\n`;
    code += `  pinMode(TRIG_PIN, OUTPUT);\n`;
    code += `  pinMode(ECHO_PIN, INPUT);\n`;
    code += `  pinMode(LINE_LEFT, INPUT);\n`;
    code += `  pinMode(LINE_RIGHT, INPUT);\n`;
    code += `  pinMode(BUILTIN_LED, OUTPUT);\n`;

    if (usesServo) {
        code += `  servo1.attach(SERVO_PIN);\n`;
    }

    // --- ¡NUEVA LÓGICA DE GENERACIÓN DE SETUP! ---
    code += `  \n  // --- Código de Setup (Bloques) ---\n`;
    try {
        const setupHatBlock = allBlocks.find(b => b.type === 'robot_setup');
        if (setupHatBlock) {
            let nextBlock = setupHatBlock.getNextBlock();
            while (nextBlock) {
                const blockCode = Blockly.JavaScript.blockToCode(nextBlock);
                if (blockCode) code += `  ${blockCode.replace(/\n/g, '\n  ')}\n`; // Indentar
                nextBlock = nextBlock.getNextBlock();
            }
        }
    } catch (e) {
        console.error('Error generando setup:', e);
    }
    // --- FIN NUEVA LÓGICA ---

    code += `  \n  Serial.println("Robot listo!");\n`;
    code += `}\n\n`;

    // === LOOP ===
    code += `// === LOOP ===\nvoid loop() {\n`;

    // --- ¡NUEVA LÓGICA DE GENERACIÓN DE LOOP! ---
    code += `  // --- Código de Loop (Bloques) ---\n`;
    try {
        const loopHatBlock = allBlocks.find(b => b.type === 'robot_loop');
        if (loopHatBlock) {
            let nextBlock = loopHatBlock.getNextBlock();
            while (nextBlock) {
                const blockCode = Blockly.JavaScript.blockToCode(nextBlock);
                if (blockCode) code += `  ${blockCode.replace(/\n/g, '\n  ')}\n`; // Indentar
                nextBlock = nextBlock.getNextBlock();
            }
        }
    } catch (e) {
        console.error('Error generando loop:', e);
    }
    // --- FIN NUEVA LÓGICA ---

    code += `}\n`; // <-- El bug de la pestaña loop estaba aquí, pero ya lo corregimos

    return {
        full: code,
        setup: extractSetup(code),
        loop: extractLoop(code)
    };
}


function extractSetup(fullCode) {
    const setupMatch = fullCode.match(/void setup\(\) \{([\s\S]*?)\n\}/);
    return setupMatch ? `void setup() {\n${setupMatch[1]}\n}` : '';
}

function extractLoop(fullCode) {
    // CORRECCIÓN: Añadido \s*$ para permitir espacios/saltos de línea al final
    const loopMatch = fullCode.match(/void loop\(\) \{([\s\S]*?)\n\}\s*$/);
    return loopMatch ? `void loop() {\n${loopMatch[1]}\n}` : '';
}