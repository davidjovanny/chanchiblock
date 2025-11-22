// Definición de bloques personalizados para el robot

// ===== BLOQUES DE MOVIMIENTO =====

Blockly.Blocks['robot_forward'] = {
    init: function () {
        this.appendDummyInput().appendField("⬆️ " + (currentLanguage === 'es' ? "Avanzar" : "Forward"));
        this.appendValueInput("SPEED")
            .setCheck("Number")
            .appendField(currentLanguage === 'es' ? "velocidad" : "speed");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
        this.setTooltip("El robot avanza hacia adelante con velocidad (0-255)");
    }
};

Blockly.Blocks['robot_backward'] = {
    init: function () {
        this.appendDummyInput().appendField("⬇️ " + (currentLanguage === 'es' ? "Retroceder" : "Backward"));
        this.appendValueInput("SPEED")
            .setCheck("Number")
            .appendField(currentLanguage === 'es' ? "velocidad" : "speed");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
    }
};

Blockly.Blocks['robot_turn_left'] = {
    init: function () {
        this.appendDummyInput().appendField("⬅️ " + (currentLanguage === 'es' ? "Girar Izquierda" : "Turn Left"));
        this.appendValueInput("SPEED")
            .setCheck("Number")
            .appendField(currentLanguage === 'es' ? "velocidad" : "speed");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
    }
};

Blockly.Blocks['robot_turn_right'] = {
    init: function () {
        this.appendDummyInput().appendField("➡️ " + (currentLanguage === 'es' ? "Girar Derecha" : "Turn Right"));
        this.appendValueInput("SPEED")
            .setCheck("Number")
            .appendField(currentLanguage === 'es' ? "velocidad" : "speed");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
    }
};

Blockly.Blocks['robot_stop'] = {
    init: function () {
        this.appendDummyInput().appendField("⛔ " + (currentLanguage === 'es' ? "Detener" : "Stop"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
    }
};

// ===== BLOQUE DE DELAY =====

Blockly.Blocks['robot_delay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("⏱️ " + (currentLanguage === 'es' ? "Esperar" : "Wait"))
            .appendField(new Blockly.FieldNumber(1000, 0, 10000), "TIME")
            .appendField("ms");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
    }
};

// ===== BLOQUES DE SENSORES =====

Blockly.Blocks['robot_read_distance'] = {
    init: function () {
        this.appendDummyInput().appendField("📏 " + (currentLanguage === 'es' ? "Distancia (cm)" : "Distance (cm)"));
        this.setOutput(true, "Number");
        this.setColour(160);
    }
};

Blockly.Blocks['robot_if_distance'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("❓ " + (currentLanguage === 'es' ? "Si distancia <" : "If distance <"))
            .appendField(new Blockly.FieldNumber(20, 0, 400), "DISTANCE")
            .appendField("cm");
        this.appendStatementInput("DO")
            .appendField(currentLanguage === 'es' ? "hacer" : "do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};

// ===== BLOQUE DE SERVO =====

Blockly.Blocks['robot_servo'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("🔄 " + (currentLanguage === 'es' ? "Servo a" : "Servo to"))
            .appendField(new Blockly.FieldAngle(90), "ANGLE")
            .appendField("°");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
    }
};

// ===== BLOQUES GPIO =====

Blockly.Blocks['gpio_pin_mode'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📌 " + (currentLanguage === 'es' ? "Configurar GPIO" : "Configure GPIO"))
            .appendField(new Blockly.FieldDropdown(ESP32_PINS.map(p => [`GPIO ${p}`, p.toString()])), "PIN")
            .appendField(currentLanguage === 'es' ? "como" : "as")
            .appendField(new Blockly.FieldDropdown([
                [currentLanguage === 'es' ? "Salida" : "Output", "OUTPUT"],
                [currentLanguage === 'es' ? "Entrada" : "Input", "INPUT"],
                [currentLanguage === 'es' ? "Entrada Pull-Up" : "Input Pull-Up", "INPUT_PULLUP"]
            ]), "MODE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};

Blockly.Blocks['gpio_digital_write'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📌 " + (currentLanguage === 'es' ? "Escribir GPIO" : "Write GPIO"))
            .appendField(new Blockly.FieldDropdown(ESP32_PINS.map(p => [`GPIO ${p}`, p.toString()])), "PIN")
            .appendField("=")
            .appendField(new Blockly.FieldDropdown([
                [currentLanguage === 'es' ? "ALTO" : "HIGH", "HIGH"],
                [currentLanguage === 'es' ? "BAJO" : "LOW", "LOW"]
            ]), "STATE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};


Blockly.Blocks['math_random_int'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(currentLanguage === 'es' ? "🎲 Número aleatorio entre" : "🎲 Random number from")
            .appendField(new Blockly.FieldNumber(1), 'FROM')
            .appendField(currentLanguage === 'es' ? "y" : "and")
            .appendField(new Blockly.FieldNumber(100), 'TO');
        this.setOutput(true, 'Number');
        this.setColour(230); // Color de "Math"
        this.setTooltip(currentLanguage === 'es' ? "Genera un número entero aleatorio" : "Generates a random integer");
    }
};

Blockly.Blocks['gpio_digital_read'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📌 " + (currentLanguage === 'es' ? "Leer GPIO" : "Read GPIO"))
            .appendField(new Blockly.FieldDropdown(ESP32_PINS.map(p => [`GPIO ${p}`, p.toString()])), "PIN");
        this.setOutput(true, "Boolean");
        this.setColour(160);
    }
};

Blockly.Blocks['gpio_analog_read'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📊 " + (currentLanguage === 'es' ? "Leer Analógico" : "Read Analog"))
            .appendField(new Blockly.FieldDropdown(
                ESP32_ADC_PINS.map(p => [`GPIO ${p}`, p.toString()])
            ), "PIN");
        this.setOutput(true, "Number");
        this.setColour(160);
    }
};

Blockly.Blocks['gpio_analog_write'] = {
    init: function () {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("📌 PWM GPIO")
            .appendField(new Blockly.FieldDropdown(ESP32_PINS.map(p => [`GPIO ${p}`, p.toString()])), "PIN")
            .appendField("=");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};

// ===== BLOQUES DE ESTRUCTURA (SETUP/LOOP) =====

Blockly.Blocks['robot_setup'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("🚀 " + (currentLanguage === 'es' ? "Al Iniciar (Setup)" : "On Start (Setup)"));
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("Código que se ejecuta una sola vez al iniciar el robot.");
    }
};

Blockly.Blocks['robot_loop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("🔄 " + (currentLanguage === 'es' ? "Repetir Siempre (Loop)" : "Repeat Forever (Loop)"));
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("Código que se repite continuamente.");
    }
};

// ===== BLOQUES SERIAL =====

Blockly.Blocks['serial_begin'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📡 " + (currentLanguage === 'es' ? "Iniciar Serial a" : "Start Serial at"))
            .appendField(new Blockly.FieldDropdown([
                ["9600", "9600"],
                ["115200", "115200"],
                ["230400", "230400"]
            ]), "BAUD")
            .appendField(currentLanguage === 'es' ? "baudios" : "baud");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
    }
};

Blockly.Blocks['serial_print'] = {
    init: function () {
        this.appendValueInput("TEXT")
            .appendField("📤 " + (currentLanguage === 'es' ? "Enviar por Serial" : "Send via Serial"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
    }
};

// ===== BLOQUES WIFI =====

Blockly.Blocks['wifi_connect'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📶 " + (currentLanguage === 'es' ? "Conectar WiFi" : "Connect WiFi"));
        this.appendDummyInput()
            .appendField("SSID:")
            .appendField(new Blockly.FieldTextInput("MiWiFi"), "SSID");
        this.appendDummyInput()
            .appendField(currentLanguage === 'es' ? "Contraseña:" : "Password:")
            .appendField(new Blockly.FieldTextInput("12345678"), "PASS");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
    }
};

// ===== BLOQUES BLUETOOTH =====

Blockly.Blocks['bt_begin'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("📲 " + (currentLanguage === 'es' ? "Iniciar Bluetooth" : "Start Bluetooth"))
            .appendField(new Blockly.FieldTextInput("ESP32_Robot"), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
    }
};

Blockly.Blocks['bt_print'] = {
    init: function () {
        this.appendValueInput("TEXT")
            .appendField("📤 " + (currentLanguage === 'es' ? "Enviar por Bluetooth" : "Send via Bluetooth"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
    }
};

// ===== BLOQUE TEST LED INTERNO =====

Blockly.Blocks['test_builtin_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("💡 " + (currentLanguage === 'es' ? "Parpadear LED interno" : "Blink built-in LED"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
    }
};

// ===== BLOQUES DE VARIABLES =====

Blockly.Blocks['create_variable'] = {
    init: function () {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("🔢 " + (currentLanguage === 'es' ? "Crear variable" : "Create variable"))
            .appendField(new Blockly.FieldTextInput("miVariable"), "VAR_NAME")
            .appendField(new Blockly.FieldDropdown([
                ["int", "int"],
                ["long", "long"],
                ["float", "float"],
                ["bool", "bool"]
            ]), "VAR_TYPE")
            .appendField("=");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
    }
};

Blockly.Blocks['set_variable'] = {
    init: function () {
        this.appendValueInput("VALUE")
            .appendField("🔢 " + (currentLanguage === 'es' ? "Asignar a" : "Set"))
            .appendField(new Blockly.FieldTextInput("miVariable"), "VAR_NAME")
            .appendField("=");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
    }
};

Blockly.Blocks['get_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("🔢")
            .appendField(new Blockly.FieldTextInput("miVariable"), "VAR_NAME");
        this.setOutput(true, null);
        this.setColour(330);
    }
};

// ===== BLOQUE TIMER (millis) =====

Blockly.Blocks['millis_timer'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("⏱️ " + (currentLanguage === 'es' ? "Temporizador (ms)" : "Timer (ms)"));
        this.setOutput(true, "Number");
        this.setColour(120);
        this.setTooltip("Retorna el tiempo en milisegundos desde que se inició");
    }
};

// Función para obtener el toolbox con traducciones
function getToolbox() {
    return {
        "kind": "categoryToolbox",
        "contents": [{
            "kind": "category",
            "name": "⚙️ " + (currentLanguage === 'es' ? "Setup" : "Setup"),
            "colour": 200,
            "contents": [{
                "kind": "block",
                "type": "robot_setup"
            }, {
                "kind": "block",
                "type": "serial_begin"
            }, {
                "kind": "block",
                "type": "wifi_connect"
            }, {
                "kind": "block",
                "type": "bt_begin"
            }, {
                "kind": "block",
                "type": "gpio_pin_mode"
            }]
        }, {
            "kind": "category",
            "name": "🎮 Control",
            "colour": 120,
            "contents": [{
                "kind": "block",
                "type": "robot_loop"
            }, {
                "kind": "block",
                "type": "controls_whileUntil"
            }, {
                "kind": "block",
                "type": "controls_if"
            }, {
                "kind": "block",
                "type": "robot_delay"
            }, {
                "kind": "block",
                "type": "millis_timer"
            }]
        }, {
            "kind": "category",
            "name": "🚗 " + (currentLanguage === 'es' ? "Movimiento" : "Movement"),
            "colour": 260,
            "contents": [{
                "kind": "block",
                "type": "robot_forward"
            }, {
                "kind": "block",
                "type": "robot_backward"
            }, {
                "kind": "block",
                "type": "robot_turn_left"
            }, {
                "kind": "block",
                "type": "robot_turn_right"
            }, {
                "kind": "block",
                "type": "robot_stop"
            }]
        }, {
            "kind": "category",
            "name": "📡 " + (currentLanguage === 'es' ? "Sensores" : "Sensors"),
            "colour": 160,
            "contents": [{
                "kind": "block",
                "type": "robot_read_distance"
            }, {
                "kind": "block",
                "type": "robot_if_distance"
            }]
        }, {
            "kind": "category",
            "name": "🎯 " + (currentLanguage === 'es' ? "Servos" : "Servos"),
            "colour": 290,
            "contents": [{
                "kind": "block",
                "type": "robot_servo"
            }]
        }, {
            "kind": "category",
            "name": "📌 GPIO",
            "colour": 160,
            "contents": [{
                "kind": "block",
                "type": "test_builtin_led"
            }, {
                "kind": "block",
                "type": "gpio_digital_write"
            }, {
                "kind": "block",
                "type": "gpio_digital_read"
            }, {
                "kind": "block",
                "type": "gpio_analog_read"
            }, {
                "kind": "block",
                "type": "gpio_analog_write"
            }]
        }, {
            "kind": "category",
            "name": "🔢 " + (currentLanguage === 'es' ? "Variables" : "Variables"),
            "colour": 330,
            "contents": [{
                "kind": "block",
                "type": "create_variable"
            }, {
                "kind": "block",
                "type": "set_variable"
            }, {
                "kind": "block",
                "type": "get_variable"
            }]
        }, {
            "kind": "category",
            "name": "📤 " + (currentLanguage === 'es' ? "Comunicación" : "Communication"),
            "colour": 200,
            "contents": [{
                "kind": "block",
                "type": "serial_print"
            }, {
                "kind": "block",
                "type": "bt_print"
            }]
        }, {
            "kind": "category",
            "name": "🔢 " + (currentLanguage === 'es' ? "Matemáticas" : "Math"),
            "colour": 230,
            "contents": [{
                "kind": "block",
                "type": "math_number"
            }, {
                "kind": "block",
                "type": "math_arithmetic"
            }, {
                "kind": "block",
                "type": "logic_compare"
            }, {
                "kind": "block",
                "type": "logic_operation"
            }, {
                "kind": "block",
                "type": "math_random_int" // <-- AÑADE ESTA LÍNEA
            }, {
                "kind": "block",
                "type": "logic_boolean"
            }]
        }, {
            "kind": "category",
            "name": "📝 " + (currentLanguage === 'es' ? "Texto" : "Text"),
            "colour": 160,
            "contents": [{
                "kind": "block",
                "type": "text"
            }, {
                "kind": "block",
                "type": "text_join"
            }]
        }]
    };
}