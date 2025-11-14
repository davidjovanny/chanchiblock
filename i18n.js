// Sistema de traducciones
const translations = {
    es: {
        // Header
        title: "Editor Blockly - Robot ESP32",

        // Buttons
        btn_config: "Configurar Pines",
        btn_generate: "Generar Código",
        btn_upload: "Subir al Robot",
        btn_clear: "Limpiar",
        btn_save: "Guardar",
        btn_cancel: "Cancelar",

        // Tabs
        tab_setup: "Setup",
        tab_loop: "Loop",
        tab_full: "CÃ³digo Completo",

        // Modal
        modal_title: "Configuración de Pines",
        label_motor_left_a: "Motor Izquierdo - Pin A:",
        label_motor_left_b: "Motor Izquierdo - Pin B:",
        label_motor_right_a: "Motor Derecho - Pin A:",
        label_motor_right_b: "Motor Derecho - Pin B:",
        label_trig: "Ultrasonido - TRIG:",
        label_echo: "Ultrasonido - ECHO:",
        label_line_left: "Sensor Línea Izq:",
        label_line_right: "Sensor Línea Der:",
        label_servo: "Servo Pin:",

        // Status
        status_checking: "Verificando servidor...",
        status_connected: "Servidor conectado",
        status_disconnected: "Servidor desconectado",
        blocks_count: "bloques",

        // Progress
        progress_compiling: "Compilando...",
        progress_uploading: "Subiendo...",
        progress_preparing: "Preparando código...",
        progress_connecting: "Conectando con ESP32...",
        progress_success: "¡Completado!",

        // Alerts
        alert_config_saved: "Configuración guardada!\n\nGenera el código nuevamente para aplicar los cambios.",
        alert_server_offline: "Servidor no conectado.\n\nInicia: python servidorESP.py",
        alert_no_ports: "No hay puertos COM.\n\nConecta el ESP32 por USB.",
        alert_select_port: "Selecciona el puerto:",
        alert_port_number: "\nEscribe el número:",
        alert_invalid_port: "Puerto inválido",
        alert_upload_info: "Compilando y subiendo...\n\nEsto toma 30-60 segundos.\n\n ¡Si falla, presiona BOOT en el ESP32.",
        alert_upload_success: "¡Código subido exitosamente!\n\nEl robot está funcionando.",
        alert_upload_error: "Error:\n\n",
        alert_network_error: "Error de red:\n\n",
        alert_clear_confirm: "¿Limpiar todos los bloques?",

        // Blocks
        block_forward: "Avanzar",
        block_backward: "Retroceder",
        block_turn_left: "Girar Izquierda",
        block_turn_right: "Girar Derecha",
        block_stop: "Detener",
        block_delay: "Esperar",
        block_distance: "Distancia (cm)",
        block_if_distance: "Si distancia <",
        block_servo: "Servo a",

        // Categories
        cat_control: "Control",
        cat_movement: "Movimiento",
        cat_sensors: "Sensores",
        cat_servos: "Servos",
        cat_gpio: "GPIO",
        cat_serial: "Serial",
        cat_wifi: "WiFi",
        cat_bluetooth: "Bluetooth",
        cat_logic: "Lógica"
    },
    en: {
        // Header
        title: "Blockly Editor - ESP32 Robot",

        // Buttons
        btn_config: "Configure Pins",
        btn_generate: "Generate Code",
        btn_upload: "Upload to Robot",
        btn_clear: "Clear",
        btn_save: "Save",
        btn_cancel: "Cancel",

        // Tabs
        tab_setup: "Setup",
        tab_loop: "Loop",
        tab_full: "Full Code",

        // Modal
        modal_title: "Pin Configuration",
        label_motor_left_a: "Left Motor - Pin A:",
        label_motor_left_b: "Left Motor - Pin B:",
        label_motor_right_a: "Right Motor - Pin A:",
        label_motor_right_b: "Right Motor - Pin B:",
        label_trig: "Ultrasonic - TRIG:",
        label_echo: "Ultrasonic - ECHO:",
        label_line_left: "Line Sensor Left:",
        label_line_right: "Line Sensor Right:",
        label_servo: "Servo Pin:",

        // Status
        status_checking: "Checking server...",
        status_connected: "Server connected",
        status_disconnected: "Server disconnected",
        blocks_count: "blocks",

        // Progress
        progress_compiling: "Compiling...",
        progress_uploading: "Uploading...",
        progress_preparing: "Preparing code...",
        progress_connecting: "Connecting to ESP32...",
        progress_success: "Completed!",

        // Alerts
        alert_config_saved: "Configuration saved!\n\nGenerate code again to apply changes.",
        alert_server_offline: "Server not connected.\n\nRun: python servidorESP.py",
        alert_no_ports: "No COM ports detected.\n\nConnect ESP32 via USB.",
        alert_select_port: "Select port:",
        alert_port_number: "\nEnter number:",
        alert_invalid_port: "Invalid port",
        alert_upload_info: "Compiling and uploading...\n\nThis takes 30-60 seconds.\n\nIf it fails, press BOOT button on ESP32.",
        alert_upload_success: "Code uploaded successfully!\n\nRobot is running.",
        alert_upload_error: "Error:\n\n",
        alert_network_error: "Network error:\n\n",
        alert_clear_confirm: "Clear all blocks?",

        // Blocks
        block_forward: "Forward",
        block_backward: "Backward",
        block_turn_left: "Turn Left",
        block_turn_right: "Turn Right",
        block_stop: "Stop",
        block_delay: "Wait",
        block_distance: "Distance (cm)",
        block_if_distance: "If distance <",
        block_servo: "Servo to",

        // Categories
        cat_control: "Control",
        cat_movement: "Movement",
        cat_sensors: "Sensors",
        cat_servos: "Servos",
        cat_gpio: "GPIO",
        cat_serial: "Serial",
        cat_wifi: "WiFi",
        cat_bluetooth: "Bluetooth",
        cat_logic: "Logic"
    }
};

// FunciÃ³n para obtener traducciÃ³n
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Cambiar idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    saveLanguageToStorage(lang);
    updateUI();
}

// Actualizar toda la interfaz
function updateUI() {
    // Verificar que los elementos existan antes de actualizar
    const elements = {
        'title': t('title'),
        'btn_config': t('btn_config'),
        'btn_generate': t('btn_generate'),
        'btn_upload': t('btn_upload'),
        'btn_clear': t('btn_clear'),
        'btn_save': t('btn_save'),
        'btn_cancel': t('btn_cancel'),
        'tab_setup': t('tab_setup'),
        'tab_loop': t('tab_loop'),
        'tab_full': t('tab_full'),
        'modal_title': t('modal_title'),
        'label_motor_left_a': t('label_motor_left_a'),
        'label_motor_left_b': t('label_motor_left_b'),
        'label_motor_right_a': t('label_motor_right_a'),
        'label_motor_right_b': t('label_motor_right_b'),
        'label_trig': t('label_trig'),
        'label_echo': t('label_echo'),
        'label_line_left': t('label_line_left'),
        'label_line_right': t('label_line_right'),
        'label_servo': t('label_servo')
    };

    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = elements[id];
        }
    }

    // Actualizar bloques de Blockly si el workspace existe
    if (typeof workspace !== 'undefined' && workspace !== null) {
        workspace.updateToolbox(getToolbox());
    }
}

// NO ejecutar automÃ¡ticamente al cargar este archivo
// Se ejecutarÃ¡ desde app.js cuando todo estÃ© listo