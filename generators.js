// Generadores de código Arduino/C++ para Chanchiblock
// Actualizado: Nombres legibles y corrección de duplicados

if (!Blockly.JavaScript) {
    Blockly.JavaScript = new Blockly.Generator('JavaScript');
}

if (!Blockly.JavaScript.forBlock) {
    Blockly.JavaScript.forBlock = {};
}

// ===== 1. GENERADORES DE TEXTO =====

Blockly.JavaScript.forBlock['text'] = function(block) {
    const text = block.getFieldValue('TEXT');
    const safeText = text.replace(/"/g, '\\"');
    return [`"${safeText}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['text_join'] = function(block) {
    if (block.itemCount_ == 0) {
        return ['""', Blockly.JavaScript.ORDER_ATOMIC];
    } else if (block.itemCount_ == 1) {
        var element = Blockly.JavaScript.valueToCode(block, 'ADD0',
            Blockly.JavaScript.ORDER_NONE) || '""';
        return ['String(' + element + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
    } else {
        var code = 'String(' + (Blockly.JavaScript.valueToCode(block, 'ADD0',
            Blockly.JavaScript.ORDER_ADDITION) || '""') + ')';
        for (var i = 1; i < block.itemCount_; i++) {
            code += ' + String(' + (Blockly.JavaScript.valueToCode(block, 'ADD' + i,
                Blockly.JavaScript.ORDER_ADDITION) || '""') + ')';
        }
        return [code, Blockly.JavaScript.ORDER_ADDITION];
    }
};

// ===== 2. MOVIMIENTO =====

Blockly.JavaScript.forBlock['robot_forward'] = function(block) {
    const speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC) || '255';
    return `avanzar(${speed});\n`;
};

Blockly.JavaScript.forBlock['robot_backward'] = function(block) {
    const speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC) || '255';
    return `retroceder(${speed});\n`;
};

Blockly.JavaScript.forBlock['robot_turn_left'] = function(block) {
    const speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC) || '255';
    return `girarIzquierda(${speed});\n`;
};

Blockly.JavaScript.forBlock['robot_turn_right'] = function(block) {
    const speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC) || '255';
    return `girarDerecha(${speed});\n`;
};

Blockly.JavaScript.forBlock['robot_stop'] = function(block) {
    return 'detener();\n';
};

// ===== 3. SENSORES Y UTILS =====

Blockly.JavaScript.forBlock['robot_delay'] = function(block) {
    const time = block.getFieldValue('TIME');
    return `delay(${time});\n`;
};

Blockly.JavaScript.forBlock['robot_read_distance'] = function(block) {
    return ['leerDistancia()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.forBlock['robot_if_distance'] = function(block) {
    const distance = block.getFieldValue('DISTANCE');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `long distancia = leerDistancia();\nif (distancia < ${distance}) {\n${statements}}\n`;
};

Blockly.JavaScript.forBlock['serial_print_distance_inches'] = function(block) {
    return `Serial.print("Distancia: ");\nSerial.print(leerDistancia() / 2.54);\nSerial.println(" in");\n`;
};

Blockly.JavaScript.forBlock['serial_print_distance_feet'] = function(block) {
    return `
    {
      float inchesTotal = leerDistancia() / 2.54;
      int feet = (int)inchesTotal / 12;
      float inches = inchesTotal - (feet * 12);
      Serial.print("Distancia: ");
      Serial.print(feet);
      Serial.print("' ");
      Serial.print(inches);
      Serial.println("\\"");
    }\n`;
};

Blockly.JavaScript.forBlock['robot_servo'] = function(block) {
    const angle = block.getFieldValue('ANGLE');
    return `servo1.write(${angle});\n`;
};

Blockly.JavaScript.forBlock['math_random_int'] = function(block) {
    var from = block.getFieldValue('FROM') || '1';
    var to = block.getFieldValue('TO') || '100';
    var code = `randomInt(${from}, ${to})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// ===== 4. GPIO (VARIABLES EN PINES) =====

Blockly.JavaScript.forBlock['gpio_pin_mode'] = function(block) {
    const pin = Blockly.JavaScript.valueToCode(block, 'PIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const mode = block.getFieldValue('MODE');
    return `pinMode(${pin}, ${mode});\n`;
};

Blockly.JavaScript.forBlock['gpio_digital_write'] = function(block) {
    const pin = Blockly.JavaScript.valueToCode(block, 'PIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const state = block.getFieldValue('STATE');
    return `digitalWrite(${pin}, ${state});\n`;
};

Blockly.JavaScript.forBlock['gpio_digital_read'] = function(block) {
    const pin = Blockly.JavaScript.valueToCode(block, 'PIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`digitalRead(${pin})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.forBlock['gpio_analog_read'] = function(block) {
    const pin = Blockly.JavaScript.valueToCode(block, 'PIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`analogRead(${pin})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.forBlock['gpio_analog_write'] = function(block) {
    const pin = Blockly.JavaScript.valueToCode(block, 'PIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `analogWrite(${pin}, ${value});\n`;
};

// ===== 5. COMUNICACIÓN =====

Blockly.JavaScript.forBlock['serial_begin'] = function(block) {
    const baud = block.getFieldValue('BAUD');
    return `Serial.begin(${baud});\n`;
};

Blockly.JavaScript.forBlock['serial_print'] = function(block) {
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `Serial.println(${text});\n`;
};

Blockly.JavaScript.forBlock['wifi_connect'] = function(block) {
    const ssid = block.getFieldValue('SSID');
    const pass = block.getFieldValue('PASS');
    return `WiFi.mode(WIFI_STA);\nWiFi.begin("${ssid}", "${pass}");\nwhile (WiFi.status() != WL_CONNECTED) {\n  delay(500);\n  Serial.print(".");\n}\nSerial.println("\\nWiFi conectado!");\nSerial.print("IP: ");\nSerial.println(WiFi.localIP());\n`;
};

Blockly.JavaScript.forBlock['bt_begin'] = function(block) {
    const name = block.getFieldValue('NAME');
    return `SerialBT.begin("${name}");\nSerial.println("Bluetooth iniciado: ${name}");\n`;
};

Blockly.JavaScript.forBlock['bt_print'] = function(block) {
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `SerialBT.println(${text});\n`;
};

Blockly.JavaScript.forBlock['bt_available'] = function(block) {
    return ['SerialBT.available()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.forBlock['bt_read'] = function(block) {
    return ['SerialBT.readString()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.forBlock['bt_read_char'] = function(block) {
    return ['(char)SerialBT.read()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.forBlock['test_builtin_led'] = function(block) {
    return `digitalWrite(${ESP32_BUILTIN_LED}, HIGH);\ndelay(500);\ndigitalWrite(${ESP32_BUILTIN_LED}, LOW);\ndelay(500);\n`;
};

// ===== 6. VARIABLES (SOLUCIÓN DEFINITIVA) =====

// 1. Crear Variable: Devuelve VACÍO para que no ensucie el setup/loop.
// La declaración real se hace en generateFullCode leyendo el nombre bonito.
Blockly.JavaScript.forBlock['create_variable'] = function(block) {
    return '';
};

// 2. Asignar Variable: Usa el nombre bonito.
Blockly.JavaScript.forBlock['set_variable'] = function(block) {
    // .getText() obtiene el nombre "David" en lugar del ID "a1b2..."
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getField('VAR_NAME').getText(), Blockly.Variables.NAME_TYPE);
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `${varName} = ${value};\n`;
};

// 3. Obtener Variable: Usa el nombre bonito.
Blockly.JavaScript.forBlock['get_variable'] = function(block) {
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getField('VAR_NAME').getText(), Blockly.Variables.NAME_TYPE);
    return [varName, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['millis_timer'] = function(block) {
    return ['millis()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// ===== 7. CONTROL Y LÓGICA (OVERRIDES CON NOMBRES REALES) =====

Blockly.JavaScript.forBlock['controls_if'] = function(block) {
    var n = 0;
    var code = '',
        branchCode, conditionCode;
    do {
        conditionCode = Blockly.JavaScript.valueToCode(block, 'IF' + n,
            Blockly.JavaScript.ORDER_NONE) || 'false';
        branchCode = Blockly.JavaScript.statementToCode(block, 'DO' + n);
        code += (n > 0 ? ' else ' : '') +
            'if (' + conditionCode + ') {\n' + branchCode + '}';
        ++n;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
        branchCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
        code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
};

Blockly.JavaScript.forBlock['controls_whileUntil'] = function(block) {
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
        until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
        Blockly.JavaScript.ORDER_NONE) || 'false';
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    if (until) {
        argument0 = '!' + argument0;
    }
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.JavaScript.forBlock['controls_for'] = function(block) {
    // Usamos el nombre REAL de la variable del loop
    var variable0 = Blockly.JavaScript.nameDB_.getName(
        block.getField('VAR').getText(), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var increment = Blockly.JavaScript.valueToCode(block, 'BY',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');

    var code;
    if (Blockly.utils && Blockly.utils.string && Blockly.utils.string.isNumber(argument0) &&
        Blockly.utils.string.isNumber(argument1) && Blockly.utils.string.isNumber(increment)) {
        var up = parseFloat(argument0) <= parseFloat(argument1);
        code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
            variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
            variable0;
        var step = Math.abs(parseFloat(increment));
        if (step == 1) {
            code += (up ? '++' : '--');
        } else {
            code += (up ? ' += ' : ' -= ') + step;
        }
        code += ') {\n' + branch + '}\n';
    } else {
        code = 'for (' + variable0 + ' = ' + argument0 + '; ' + variable0 + ' <= ' + argument1 + '; ' + variable0 + ' += ' + increment + ') {\n' + branch + '}\n';
    }
    return code;
};

Blockly.JavaScript.forBlock['logic_compare'] = function(block) {
    var OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = (operator == '==' || operator == '!=') ? Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
    return [argument0 + ' ' + operator + ' ' + argument1, order];
};

Blockly.JavaScript.forBlock['logic_operation'] = function(block) {
    var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
    var order = (operator == '&&') ? Blockly.JavaScript.ORDER_LOGICAL_AND : Blockly.JavaScript.ORDER_LOGICAL_OR;
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || 'false';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || 'false';
    return [argument0 + ' ' + operator + ' ' + argument1, order];
};

Blockly.JavaScript.forBlock['logic_boolean'] = function(block) {
    return [(block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_number'] = function(block) {
    return [parseFloat(block.getFieldValue('NUM')), Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_arithmetic'] = function(block) {
    var OPERATORS = {
        'ADD': [' + ', Blockly.JavaScript.ORDER_ADDITION],
        'MINUS': [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
        'MULTIPLY': [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
        'DIVIDE': [' / ', Blockly.JavaScript.ORDER_DIVISION],
        'POWER': [null, Blockly.JavaScript.ORDER_COMMA]
    };
    var tuple = OPERATORS[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
    if (!operator) return ['pow(' + argument0 + ', ' + argument1 + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
    return [argument0 + operator + argument1, order];
};

// ===== 8. LED STRIP =====
Blockly.JavaScript.forBlock['neopixel_setup'] = function(block) {
    return '';
};
Blockly.JavaScript.forBlock['neopixel_set_color'] = function(block) {
    const index = Blockly.JavaScript.valueToCode(block, 'LED_INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const color = block.getFieldValue('COLOR');
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    return `strip.setPixelColor(${index}, strip.Color(${r}, ${g}, ${b}));\n`;
};
Blockly.JavaScript.forBlock['neopixel_set_color_rgb'] = function(block) {
    const index = Blockly.JavaScript.valueToCode(block, 'LED_INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const r = Blockly.JavaScript.valueToCode(block, 'R', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const g = Blockly.JavaScript.valueToCode(block, 'G', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `strip.setPixelColor(${index}, strip.Color(${r}, ${g}, ${b}));\n`;
};
Blockly.JavaScript.forBlock['neopixel_show'] = function(block) {
    return 'strip.show();\n';
};
Blockly.JavaScript.forBlock['neopixel_clear'] = function(block) {
    return 'strip.clear();\n';
};
Blockly.JavaScript.forBlock['neopixel_effect'] = function(block) {
    const effect = block.getFieldValue('EFFECT');
    const delay = Blockly.JavaScript.valueToCode(block, 'DELAY', Blockly.JavaScript.ORDER_ATOMIC) || '50';
    if (effect === 'RAINBOW') {
        return `rainbowEffect(${delay});\n`;
    } else if (effect === 'THEATER') {
        return `theaterChaseRainbow(${delay});\n`;
    } else if (effect === 'BREATHING') {
        return `breathingEffect(${delay});\n`;
    }
    return '';
};

// ===== 9. FUNCIÓN PRINCIPAL =====

function generateFullCode() {
    Blockly.JavaScript.init(workspace);
    const allBlocks = workspace.getAllBlocks(false);

    // Detección de usos
    const usesMovement = allBlocks.some(b => ['robot_forward', 'robot_backward', 'robot_turn_left', 'robot_turn_right', 'robot_stop'].includes(b.type));
    const usesDistance = allBlocks.some(b => ['robot_read_distance', 'robot_if_distance', 'serial_print_distance_inches', 'serial_print_distance_feet'].includes(b.type));
    const usesServo = allBlocks.some(b => b.type === 'robot_servo');
    const usesBuiltinLed = allBlocks.some(b => b.type === 'test_builtin_led');
    const usesWiFi = allBlocks.some(b => b.type === 'wifi_connect');
    const usesWebServer = allBlocks.some(b => b.type === 'wifi_server_setup' || b.type === 'wifi_server_get_cmd');
    const usesBT = allBlocks.some(b => b.type === 'bt_begin' || b.type === 'bt_print');
    const usesRandom = allBlocks.some(b => b.type === 'math_random_int');
    const usesNeoPixel = allBlocks.some(b => b.type.startsWith('neopixel_'));

    let code = `// Código generado para ESP32 - Robot\n// Generated by Chanchiblock\n\n`;
    if (usesServo) code += `#include <ESP32Servo.h>\n`;
    if (usesWiFi) code += `#include <WiFi.h>\n`;
    if (usesWebServer) code += `#include <WebServer.h>\n`;
    if (usesBT) code += `#include <BluetoothSerial.h>\nBluetoothSerial SerialBT;\n`;
    if (usesNeoPixel) code += `#include <Adafruit_NeoPixel.h>\n`;

    // Pines
    code += `\n// === CONFIGURACIÓN DE PINES (Solo los usados) ===\n`;
    if (usesMovement) code += `#define MOTOR_IZQ_A ${pinConfig.MOTOR_IZQ_A}\n#define MOTOR_IZQ_B ${pinConfig.MOTOR_IZQ_B}\n#define MOTOR_DER_A ${pinConfig.MOTOR_DER_A}\n#define MOTOR_DER_B ${pinConfig.MOTOR_DER_B}\n`;
    if (usesDistance) code += `#define TRIG_PIN ${pinConfig.TRIG_PIN}\n#define ECHO_PIN ${pinConfig.ECHO_PIN}\n`;
    if (usesServo) code += `#define SERVO_PIN ${pinConfig.SERVO_PIN}\n`;
    if (usesBuiltinLed) code += `#define BUILTIN_LED ${ESP32_BUILTIN_LED}\n`;
    code += '\n';

    // === VARIABLES GLOBALES (SOLUCIÓN DEFINITIVA) ===
    // 1. Buscamos todas las variables creadas
    const definedVars = new Set();
    const varBlocks = allBlocks.filter(b => b.type === 'create_variable');

    if (varBlocks.length > 0) {
        code += `// === VARIABLES GLOBALES ===\n`;
        varBlocks.forEach(block => {
            // CLAVE: Usar .getField('...').getText() para obtener el nombre legible
            const rawName = block.getField('VAR_NAME').getText();
            const varName = Blockly.JavaScript.nameDB_.getName(rawName, Blockly.Variables.NAME_TYPE);

            // Evitar duplicados
            if (!definedVars.has(varName)) {
                const varType = block.getFieldValue('VAR_TYPE');
                const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
                code += `${varType} ${varName} = ${value};\n`;
                definedVars.add(varName);
            }
        });
        code += '\n';
    }

    // Objetos
    if (usesServo) code += `// === OBJETOS ===\nServo servo1;\n\n`;
    if (usesWebServer) {
        code += `// === WEB SERVER ===\nWebServer server(80);\nchar lastWebCommand = 0;\n\n`;
        code += `const char INDEX_HTML[] PROGMEM = R"rawliteral(<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:sans-serif;text-align:center;background:#222;color:white}.btn{background:#4CAF50;border:none;color:white;padding:20px;font-size:24px;margin:10px;border-radius:10px;width:80px;height:80px;cursor:pointer}.btn:active{background:#3e8e41;transform:scale(0.95)}.red{background:#f44336}.blue{background:#2196F3}</style><script>function send(cmd){fetch('/cmd?val='+cmd);}</script></head><body><h1>Robot Control</h1><div><button class="btn" onclick="send('F')">⬆️</button></div><div><button class="btn" onclick="send('L')">⬅️</button><button class="btn red" onclick="send('S')">⏹️</button><button class="btn" onclick="send('R')">➡️</button></div><div><button class="btn" onclick="send('B')">⬇️</button></div><br><div><button class="btn blue" onclick="send('A')">A</button><button class="btn blue" onclick="send('B')">B</button></div></body></html>)rawliteral";\n\n`;
        code += `void handleRoot() { server.send(200, "text/html", INDEX_HTML); }\n`;
        code += `void handleCommand() { if (server.hasArg("val")) { String val = server.arg("val"); if (val.length() > 0) { lastWebCommand = val.charAt(0); Serial.println("Web CMD: " + val); } server.send(200, "text/plain", "OK"); } }\n\n`;
    }
    if (usesNeoPixel) {
        const setupBlock = allBlocks.find(b => b.type === 'neopixel_setup');
        let pin = '15';
        let numLeds = '50';
        if (setupBlock) {
            pin = setupBlock.getFieldValue('PIN');
            numLeds = setupBlock.getFieldValue('NUM_LEDS');
        }
        code += `// === NEOPIXEL ===\n#define LED_PIN ${pin}\n#define LED_COUNT ${numLeds}\nAdafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);\n\n`;
    }

    // Funciones Auxiliares
    if (usesMovement || usesDistance || usesRandom || usesNeoPixel) code += `// === FUNCIONES AUXILIARES ===\n`;
    if (usesMovement) {
        code += `void avanzar(int velocidad) { analogWrite(MOTOR_IZQ_A, velocidad); analogWrite(MOTOR_IZQ_B, 0); analogWrite(MOTOR_DER_A, velocidad); analogWrite(MOTOR_DER_B, 0); }\n`;
        code += `void retroceder(int velocidad) { analogWrite(MOTOR_IZQ_A, 0); analogWrite(MOTOR_IZQ_B, velocidad); analogWrite(MOTOR_DER_A, 0); analogWrite(MOTOR_DER_B, velocidad); }\n`;
        code += `void girarIzquierda(int velocidad) { analogWrite(MOTOR_IZQ_A, 0); analogWrite(MOTOR_IZQ_B, velocidad); analogWrite(MOTOR_DER_A, velocidad); analogWrite(MOTOR_DER_B, 0); }\n`;
        code += `void girarDerecha(int velocidad) { analogWrite(MOTOR_IZQ_A, velocidad); analogWrite(MOTOR_IZQ_B, 0); analogWrite(MOTOR_DER_A, 0); analogWrite(MOTOR_DER_B, velocidad); }\n`;
        code += `void detener() { analogWrite(MOTOR_IZQ_A, 0); analogWrite(MOTOR_IZQ_B, 0); analogWrite(MOTOR_DER_A, 0); analogWrite(MOTOR_DER_B, 0); }\n`;
    }
    if (usesDistance) code += `long leerDistancia() { digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2); digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW); long duracion = pulseIn(ECHO_PIN, HIGH, 60000); if (duracion == 0) return 999; return duracion * 0.034 / 2; }\n`;
    if (usesRandom) code += `long randomInt(long min, long max) { if (min > max) { long temp = min; min = max; max = temp; } return random(min, max + 1); }\n`;
    if (usesNeoPixel) {
        code += `void rainbowEffect(int wait) { Serial.println("Rainbow"); for(long firstPixelHue = 0; firstPixelHue < 65536; firstPixelHue += 256) { for(int i=0; i<strip.numPixels(); i++) { int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels()); strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue))); } strip.show(); delay(wait); } }\n`;
        code += `void theaterChaseRainbow(int wait) { int firstPixelHue = 0; for(int a=0; a<30; a++) { for(int b=0; b<3; b++) { strip.clear(); for(int c=b; c<strip.numPixels(); c += 3) { int hue = firstPixelHue + c * 65536L / strip.numPixels(); uint32_t color = strip.gamma32(strip.ColorHSV(hue)); strip.setPixelColor(c, color); } strip.show(); delay(wait); firstPixelHue += 65536 / 90; } } }\n`;
        code += `void breathingEffect(int wait) { for (int i = 0; i < 255; i++) { strip.fill(strip.Color(0, 0, i)); strip.show(); delay(wait/10); } for (int i = 255; i >= 0; i--) { strip.fill(strip.Color(0, 0, i)); strip.show(); delay(wait/10); } }\n`;
    }

    // Setup
    code += `// === SETUP ===\nvoid setup() {\n  delay(1000); // Wait for stability\n`;
    if (usesMovement) code += `  pinMode(MOTOR_IZQ_A, OUTPUT); pinMode(MOTOR_IZQ_B, OUTPUT); pinMode(MOTOR_DER_A, OUTPUT); pinMode(MOTOR_DER_B, OUTPUT);\n`;
    if (usesDistance) code += `  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);\n`;
    if (usesBuiltinLed) code += `  pinMode(BUILTIN_LED, OUTPUT);\n`;
    if (usesServo) code += `  servo1.attach(SERVO_PIN);\n`;
    if (usesNeoPixel) code += `  strip.begin(); strip.show(); strip.setBrightness(50);\n`;

    const usesSerial = allBlocks.some(b => b.type === 'serial_print');
    const hasSerialBegin = allBlocks.some(b => b.type === 'serial_begin');
    if ((usesSerial || usesBT || usesWebServer || allBlocks.some(b => b.type.startsWith('serial_print_distance_'))) && !hasSerialBegin) {
        code += `  Serial.begin(115200);\n`;
    }
    if (usesWebServer) code += `  server.on("/", handleRoot); server.on("/cmd", handleCommand);\n`;

    // Setup blocks
    code += `  \n  // --- Código de Setup (Bloques) ---\n`;
    const setupHatBlock = allBlocks.find(b => b.type === 'robot_setup');
    if (setupHatBlock) {
        let firstBlock = setupHatBlock.getNextBlock();
        if (firstBlock) {
            code += `  ${Blockly.JavaScript.blockToCode(firstBlock).replace(/\n/g, '\n  ')}\n`;
        }
    }

    if (usesWebServer) code += `  server.begin(); Serial.println("Servidor Web iniciado");\n`;
    code += `  \n  Serial.println("Robot listo!");\n}\n\n`;

    // Loop
    code += `// === LOOP ===\nvoid loop() {\n`;
    if (usesWebServer) code += `  server.handleClient();\n`;
    code += `  static unsigned long lastDebugTime = 0;\n  if (millis() - lastDebugTime > 5000) { lastDebugTime = millis(); Serial.println("Loop running... (Heartbeat)"); }\n`;

    code += `  // --- Código de Loop (Bloques) ---\n`;
    const loopHatBlock = allBlocks.find(b => b.type === 'robot_loop');
    if (loopHatBlock) {
        let firstBlock = loopHatBlock.getNextBlock();
        if (firstBlock) {
            code += `  ${Blockly.JavaScript.blockToCode(firstBlock).replace(/\n/g, '\n  ')}\n`;
        }
    }
    code += `}\n`;

    return {
        full: code,
        setup: extractSetup(code),
        loop: extractLoop(code)
    };
}

function extractSetup(fullCode) {
    return fullCode.match(/void setup\(\) \{([\s\S]*?)\n\}/) ? `void setup() {\n${fullCode.match(/void setup\(\) \{([\s\S]*?)\n\}/)[1]}\n}` : '';
}

function extractLoop(fullCode) {
    return fullCode.match(/void loop\(\) \{([\s\S]*?)\n\}\s*$/) ? `void loop() {\n${fullCode.match(/void loop\(\) \{([\s\S]*?)\n\}\s*$/)[1]}\n}` : '';
}