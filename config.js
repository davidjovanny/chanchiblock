// ConfiguraciÃ³n de pines del robot
let pinConfig = {
    MOTOR_IZQ_A: 25,
    MOTOR_IZQ_B: 26,
    MOTOR_DER_A: 27,
    MOTOR_DER_B: 14,
    TRIG_PIN: 5,
    ECHO_PIN: 18,
    LINE_LEFT: 19,
    LINE_RIGHT: 21,
    SERVO_PIN: 13
};

// Pines disponibles ESP32 WROOM (30 pines)
const ESP32_PINS = [
    0, 1, 2, 3, 4, 5, 12, 13, 14, 15,
    16, 17, 18, 19, 21, 22, 23, 25, 26, 27,
    32, 33, 34, 35, 36, 39
];

// NOTA: El LED interno del ESP32 de 30 pines suele estar en GPIO 2
// Pero puede variar segÃºn el fabricante. Verifica tu placa especÃ­fica.

const ESP32_BUILTIN_LED = 2; // LED interno tÃ­pico

// Pines ADC (solo lectura analÃ³gica)
const ESP32_ADC_PINS = [32, 33, 34, 35, 36, 39];

// ConfiguraciÃ³n del servidor
const SERVER_URL = 'https://queenliest-unissuant-melissia.ngrok-free.dev/';

// Variable global para el idioma actual
let currentLanguage = 'es';

// Guardar/cargar configuraciÃ³n en localStorage
function saveConfigToStorage() {
    localStorage.setItem('esp32_pin_config', JSON.stringify(pinConfig));
}

function loadConfigFromStorage() {
    const saved = localStorage.getItem('esp32_pin_config');
    if (saved) {
        pinConfig = JSON.parse(saved);
    }
}

// Guardar/cargar idioma
function saveLanguageToStorage(lang) {
    localStorage.setItem('esp32_language', lang);
}

function loadLanguageFromStorage() {
    const saved = localStorage.getItem('esp32_language');
    if (saved) {
        currentLanguage = saved;
        document.getElementById('languageSelect').value = saved;
    }
}