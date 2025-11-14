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
// ===== FUNCIÓN PRINCIPAL DE GENERACIÓN (VERSIÓN FINAL) =====

// ===== FUNCIÓN PRINCIPAL DE GENERACIÓN (VERSIÓN DEFINITIVA) =====

function generateFullCode() {
    // Inicializar el generador de código
    Blockly.JavaScript.init(workspace);

    const allBlocks = workspace.getAllBlocks(false);

    // === DETECTAR QUÉ FUNCIONALIDADES SE USAN ===
    const usesMotors = allBlocks.some(b => ['robot_forward', 'robot_backward', 'robot_turn_left', 'robot_turn_right', 'robot_stop'].includes(b.type));

    const usesDistanceSensor = allBlocks.some(b => ['robot_read_distance', 'robot_if_distance'].includes(b.type));

    const usesLineSensors = allBlocks.some(b =>
        b.type === 'gpio_digital_read' && [pinConfig.LINE_LEFT.toString(), pinConfig.LINE_RIGHT.toString()].includes(b.getFieldValue('PIN'))
    );

    const usesLED = allBlocks.some(b =>
        b.type === 'test_builtin_led' ||
        (b.type === 'gpio_digital_write' && b.getFieldValue('PIN') === ESP32_BUILTIN_LED.toString())
    );

    const usesServo = allBlocks.some(b => b.type === 'robot_servo');
    const usesWiFi = allBlocks.some(b => b.type === 'wifi_connect');
    const usesBT = allBlocks.some(b => b.type === 'bt_begin' || b.type === 'bt_print');

    // === GENERAR CÓDIGO BASE ===
    let code = `// Código generado para ESP32 - Robot\n// Generated by Blockly Editor\n\n`;

    // Librerías (solo si se usan)
    if (usesServo) code += `#include <ESP32Servo.h>\n`;
    if (usesWiFi) code += `#include <WiFi.h>\n`;
    if (usesBT) code += `#include <BluetoothSerial.h>\nBluetoothSerial SerialBT;\n`;

    // Objetos globales
    if (usesServo) code += `Servo servo1;\n\n`;

    // === DEFINIR PINES (SOLO SI SE USAN) ===
    let defines = `\n// === CONFIGURACIÓN DE PINES ===\n`;
    let hasDefines = false;

    if (usesMotors) {
        defines += `#define MOTOR_IZQ_A ${pinConfig.MOTOR_IZQ_A}\n`;
        defines += `#define MOTOR_IZQ_B ${pinConfig.MOTOR_IZQ_B}\n`;
        defines += `#define MOTOR_DER_A ${pinConfig.MOTOR_DER_A}\n`;
        defines += `#define MOTOR_DER_B ${pinConfig.MOTOR_DER_B}\n`;
        hasDefines = true;
    }

    if (usesDistanceSensor) {
        defines += `#define TRIG_PIN ${pinConfig.TRIG_PIN}\n`;
        defines += `#define ECHO_PIN ${pinConfig.ECHO_PIN}\n`;
        hasDefines = true;
    }

    if (usesLineSensors) {
        defines += `#define LINE_LEFT ${pinConfig.LINE_LEFT}\n`;
        defines += `#define LINE_RIGHT ${pinConfig.LINE_RIGHT}\n`;
        hasDefines = true;
    }

    if (usesServo) {
        defines += `#define SERVO_PIN ${pinConfig.SERVO_PIN}\n`;
        hasDefines = true;
    }

    if (usesLED) {
        defines += `#define BUILTIN_LED ${ESP32_BUILTIN_LED}\n`;
        hasDefines = true;
    }

    if (hasDefines) code += defines + `\n`;

    // Funciones del robot (solo si se usan)
    let functions = `\n// === FUNCIONES DEL ROBOT ===\n`;
    let hasFunctions = false;

    if (usesMotors) {
        functions += `void avanzar() {\n  digitalWrite(MOTOR_IZQ_A, HIGH);\n  digitalWrite(MOTOR_IZQ_B, LOW);\n  digitalWrite(MOTOR_DER_A, HIGH);\n  digitalWrite(MOTOR_DER_B, LOW);\n}\n\n`;
        functions += `void retroceder() {\n  digitalWrite(MOTOR_IZQ_A, LOW);\n  digitalWrite(MOTOR_IZQ_B, HIGH);\n  digitalWrite(MOTOR_DER_A, LOW);\n  digitalWrite(MOTOR_DER_B, HIGH);\n}\n\n`;
        functions += `void girarIzquierda() {\n  digitalWrite(MOTOR_IZQ_A, LOW);\n  digitalWrite(MOTOR_IZQ_B, HIGH);\n  digitalWrite(MOTOR_DER_A, HIGH);\n  digitalWrite(MOTOR_DER_B, LOW);\n}\n\n`;
        functions += `void girarDerecha() {\n  digitalWrite(MOTOR_IZQ_A, HIGH);\n  digitalWrite(MOTOR_IZQ_B, LOW);\n  digitalWrite(MOTOR_DER_A, LOW);\n  digitalWrite(MOTOR_DER_B, HIGH);\n}\n\n`;
        functions += `void detener() {\n  digitalWrite(MOTOR_IZQ_A, LOW);\n  digitalWrite(MOTOR_IZQ_B, LOW);\n  digitalWrite(MOTOR_DER_A, LOW);\n  digitalWrite(MOTOR_DER_B, LOW);\n}\n\n`;
        hasFunctions = true;
    }

    if (usesDistanceSensor) {
        functions += `long leerDistancia() {\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duracion = pulseIn(ECHO_PIN, HIGH, 30000);\n  if (duracion == 0) return 999;\n  return duracion * 0.034 / 2;\n}\n\n`;
        hasFunctions = true;
    }

    if (hasFunctions) code += functions;

    // === MÉTODO CORRECTO: GENERAR CÓDIGO DE BLOQUES ===

    // Generar Setup usando Blockly nativo
    let setupCode = '';
    const setupBlocks = workspace.getBlocksByType('robot_setup', false);
    if (setupBlocks.length > 0) {
        // Obtener el primer (y único) bloque de setup
        const setupBlock = setupBlocks[0];
        // Generar código para TODOS los bloques conectados después
        setupCode = Blockly.JavaScript.statementToCode(setupBlock, 'NEXT');
    }

    // Generar Loop usando Blockly nativo
    let loopCode = '';
    const loopBlocks = workspace.getBlocksByType('robot_loop', false);
    if (loopBlocks.length > 0) {
        const loopBlock = loopBlocks[0];
        loopCode = Blockly.JavaScript.statementToCode(loopBlock, 'NEXT');
    }

    // === CONSTRUIR CÓDIGO FINAL ===
    code += `void setup() {\n`;
    code += `  Serial.begin(115200);\n\n`;

    // Configuración condicional de pines
    if (usesMotors) {
        code += `  // Configurar motores\n`;
        code += `  pinMode(MOTOR_IZQ_A, OUTPUT);\n`;
        code += `  pinMode(MOTOR_IZQ_B, OUTPUT);\n`;
        code += `  pinMode(MOTOR_DER_A, OUTPUT);\n`;
        code += `  pinMode(MOTOR_DER_B, OUTPUT);\n\n`;
    }

    if (usesDistanceSensor) {
        code += `  // Configurar sensor de distancia\n`;
        code += `  pinMode(TRIG_PIN, OUTPUT);\n`;
        code += `  pinMode(ECHO_PIN, INPUT);\n\n`;
    }

    if (usesLineSensors) {
        code += `  // Configurar sensores de línea\n`;
        code += `  pinMode(LINE_LEFT, INPUT);\n`;
        code += `  pinMode(LINE_RIGHT, INPUT);\n\n`;
    }

    if (usesLED) {
        code += `  // Configurar LED interno\n`;
        code += `  pinMode(BUILTIN_LED, OUTPUT);\n\n`;
    }

    if (usesServo) {
        code += `  // Configurar servo\n`;
        code += `  servo1.attach(SERVO_PIN);\n\n`;
    }

    // Agregar código de bloques
    if (setupCode) code += `  // --- Código de Setup (Bloques) ---\n  ${setupCode.replace(/\n/g, '\n  ')}\n`;

    code += `  Serial.println("Robot listo!");\n`;
    code += `}\n\n`;

    code += `void loop() {\n`;
    if (loopCode) code += `  // --- Código de Loop (Bloques) ---\n  ${loopCode.replace(/\n/g, '\n  ')}\n`;
    code += `}\n`;

    // Devolvemos el código separado para las pestañas
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