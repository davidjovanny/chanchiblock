// Aplicación principal

let workspace;
let currentTab = 'full';
let generatedCode = {
    full: '',
    setup: '',
    loop: ''
};

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuración
    if (typeof loadConfigFromStorage === 'function') {
        loadConfigFromStorage();
    }
    if (typeof loadLanguageFromStorage === 'function') {
        loadLanguageFromStorage();
    }

    // Inicializar componentes
    initWorkspace();
    initPinSelects();
    checkServerStatus();

    // Actualizar UI con idioma
    if (typeof updateUI === 'function') {
        updateUI();
    }

    // Verificar soporte de Web Serial API
    checkWebSerialSupport();
});

function checkWebSerialSupport() {
    if (!('serial' in navigator)) {
        console.warn('⚠️  Web Serial API no soportada en este navegador');
        // Mostrar advertencia en la UI
        const warning = document.createElement('div');
        warning.style.cssText = 'background: #ff9800; color: white; padding: 10px; text-align: center;';
        warning.textContent = '⚠️ Este navegador no soporta Web Serial API. Usa Chrome o Edge para subir código al ESP32.';
        document.body.insertBefore(warning, document.body.firstChild);
    } else {
        console.log('✅ Web Serial API soportada');
    }
}

function initWorkspace() {
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: getToolbox(),
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        trashcan: true
    });

    workspace.addChangeListener(function() {
        const count = workspace.getAllBlocks(false).length;
        document.getElementById('blockCount').textContent = `${count} ${t('blocks_count')}`;
    });

    loadExampleProgram();
}

// ===== CONFIGURACIÓN DE PINES =====

function initPinSelects() {
    const selects = [
        'pin_motor_izq_a', 'pin_motor_izq_b', 'pin_motor_der_a', 'pin_motor_der_b',
        'pin_trig', 'pin_echo', 'pin_line_left', 'pin_line_right', 'pin_servo'
    ];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '';
        ESP32_PINS.forEach(pin => {
            const option = document.createElement('option');
            option.value = pin;
            option.textContent = `GPIO ${pin}`;
            select.appendChild(option);
        });
    });

    document.getElementById('pin_motor_izq_a').value = pinConfig.MOTOR_IZQ_A;
    document.getElementById('pin_motor_izq_b').value = pinConfig.MOTOR_IZQ_B;
    document.getElementById('pin_motor_der_a').value = pinConfig.MOTOR_DER_A;
    document.getElementById('pin_motor_der_b').value = pinConfig.MOTOR_DER_B;
    document.getElementById('pin_trig').value = pinConfig.TRIG_PIN;
    document.getElementById('pin_echo').value = pinConfig.ECHO_PIN;
    document.getElementById('pin_line_left').value = pinConfig.LINE_LEFT;
    document.getElementById('pin_line_right').value = pinConfig.LINE_RIGHT;
    document.getElementById('pin_servo').value = pinConfig.SERVO_PIN;
}

function openConfigModal() {
    document.getElementById('configModal').classList.add('active');
}

function closeConfigModal() {
    document.getElementById('configModal').classList.remove('active');
}

function saveConfig() {
    pinConfig.MOTOR_IZQ_A = parseInt(document.getElementById('pin_motor_izq_a').value);
    pinConfig.MOTOR_IZQ_B = parseInt(document.getElementById('pin_motor_izq_b').value);
    pinConfig.MOTOR_DER_A = parseInt(document.getElementById('pin_motor_der_a').value);
    pinConfig.MOTOR_DER_B = parseInt(document.getElementById('pin_motor_der_b').value);
    pinConfig.TRIG_PIN = parseInt(document.getElementById('pin_trig').value);
    pinConfig.ECHO_PIN = parseInt(document.getElementById('pin_echo').value);
    pinConfig.LINE_LEFT = parseInt(document.getElementById('pin_line_left').value);
    pinConfig.LINE_RIGHT = parseInt(document.getElementById('pin_line_right').value);
    pinConfig.SERVO_PIN = parseInt(document.getElementById('pin_servo').value);

    saveConfigToStorage();
    closeConfigModal();
    alert(t('alert_config_saved'));
}

// ===== GENERACIÓN DE CÓDIGO =====

function generateCode() {
    generatedCode = generateFullCode();
    displayCode();
    return generatedCode.full;
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab_${tab}`).classList.add('active');
    displayCode();
}

function displayCode() {
    const output = document.getElementById('codeOutput');
    switch (currentTab) {
        case 'setup':
            output.textContent = generatedCode.setup || '// Genera el código primero';
            break;
        case 'loop':
            output.textContent = generatedCode.loop || '// Genera el código primero';
            break;
        case 'full':
        default:
            output.textContent = generatedCode.full || '// El código aparecerá aquí...';
    }
}

// ===== BARRA DE PROGRESO =====

function showProgress(title, message) {
    const overlay = document.getElementById('progressOverlay');
    document.getElementById('progressTitle').textContent = title;
    document.getElementById('progressMessage').textContent = message;
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
    overlay.classList.add('active');
}

function updateProgress(percent, message) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = percent + '%';
    if (message) {
        document.getElementById('progressMessage').textContent = message;
    }
}

function hideProgress() {
    document.getElementById('progressOverlay').classList.remove('active');
}

// ===== SUBIR AL ROBOT (WEB SERIAL API) =====

// Mejora para la función uploadToRobot - REEMPLAZA SOLO ESTA FUNCIÓN

async function uploadToRobot() {
    const code = generateCode();

    showProgress(t('progress_compiling'), t('progress_connecting'));

    try {
        // 1. Verificar que miniFlasher esté corriendo
        updateProgress(10, currentLanguage === 'es' ? 'Verificando servidor...' : 'Checking server...');

        let miniFlasherUrl = 'http://localhost:5001';
        try {
            const healthCheck = await fetch(`${miniFlasherUrl}/api/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });

            if (!healthCheck.ok) {
                throw new Error('MiniFlasher no responde');
            }

            const healthData = await healthCheck.json();
            console.log('✅ MiniFlasher conectado:', healthData);

            if (!healthData.esp32_detected) {
                hideProgress();
                alert(currentLanguage === 'es' ?
                    '⚠️ No se detectó ESP32 conectado.\n\n🔧 Verifica:\n• ESP32 conectado por USB\n• Drivers CP210x/CH340 instalados' :
                    '⚠️ ESP32 not detected.\n\n🔧 Check:\n• ESP32 connected via USB\n• CP210x/CH340 drivers installed');
                return;
            }

        } catch (e) {
            hideProgress();
            alert(currentLanguage === 'es' ?
                '❌ No se puede conectar al servidor local (MiniFlasher).\n\n🔧 Solución:\n1. Descarga el instalador desde el botón en la interfaz\n2. Ejecuta MiniFlasher_Installer.exe\n3. El servidor local se iniciará automáticamente\n\n💡 El ícono aparecerá en la bandeja del sistema' :
                '❌ Cannot connect to local server (MiniFlasher).\n\n🔧 Solution:\n1. Download installer from interface button\n2. Run MiniFlasher_Installer.exe\n3. Local server will start automatically\n\n💡 Icon will appear in system tray');
            return;
        }

        // 2. Enviar código para compilar y flashear
        updateProgress(30, currentLanguage === 'es' ? 'Compilando código...' : 'Compiling code...');

        const flashResponse = await fetch(`${miniFlasherUrl}/api/flash`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        });

        const result = await flashResponse.json();

        if (!result.success) {
            hideProgress();
            alert(currentLanguage === 'es' ?
                `❌ Error:\n\n${result.error}\n\n💡 Si el ESP32 no entra en bootloader, mantén presionado el botón BOOT durante la subida.` :
                `❌ Error:\n\n${result.error}\n\n💡 If ESP32 doesn't enter bootloader, hold BOOT button during upload.`);
            return;
        }

        // 3. Éxito
        updateProgress(100, t('progress_success'));

        setTimeout(() => {
            hideProgress();
            alert(currentLanguage === 'es' ?
                `✅ ¡Código subido exitosamente!\n\nPuerto: ${result.port}\n\nEl robot está funcionando.` :
                `✅ Code uploaded successfully!\n\nPort: ${result.port}\n\nRobot is running.`);
        }, 1000);

    } catch (e) {
        hideProgress();
        console.error('Error:', e);
        alert(currentLanguage === 'es' ?
            `❌ Error de red:\n\n${e.message}\n\n🔧 Verifica que MiniFlasher esté corriendo.` :
            `❌ Network error:\n\n${e.message}\n\n🔧 Check that MiniFlasher is running.`);
    }
}



// ===== OTRAS FUNCIONES =====

function clearWorkspace() {
    if (confirm(t('alert_clear_confirm'))) {
        workspace.clear();
        generatedCode = {
            full: '',
            setup: '',
            loop: ''
        };
        displayCode();
    }
}

async function checkServerStatus() {
    try {
        const r = await fetch(`/api/health`, {
            timeout: 3000
        });
        if (r.ok) {
            document.getElementById('serverStatus').classList.add('online');
            document.getElementById('serverStatusText').textContent = t('status_connected');
        } else {
            throw new Error();
        }
    } catch (e) {
        document.getElementById('serverStatus').classList.remove('online');
        document.getElementById('serverStatusText').textContent = t('status_disconnected');
    }

    // Verificar cada 5 segundos
    setTimeout(checkServerStatus, 5000);
}

// ===== PROGRAMA DE EJEMPLO =====


function downloadInstaller() {
    // 1. Texto actualizado para el confirm()
    const confirmDownload = confirm(
        currentLanguage === 'es' ?
        '📥 Descargar Paquete Chanchiblock (.zip)\n\nNecesitas este paquete para conectar la web con tu ESP32.\n\n✅ Descomprímelo donde quieras\n✅ Ejecuta "START_MiniFlasher.bat" como Administrador\n\n¿Descargar ahora?' :
        '📥 Download Chanchiblock Package (.zip)\n\nYou need this package to connect the web with your ESP32.\n\n✅ Unzip it anywhere\n✅ Run "START_MiniFlasher.bat" as Administrator\n\nDownload now?'
    );

    if (confirmDownload) {
        // 2. Pega tu enlace de GitHub Releases aquí
        window.location.href = "https://github.com/davidjovanny/chanchiblock/releases/download/MiniflasherV1/MiniFlasher_Package.zip";
    }
}



function loadExampleProgram() {
    const xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="robot_setup" x="20" y="20">
    <next>
      <block type="test_builtin_led"></block>
    </next>
  </block>
  <block type="robot_loop" x="20" y="120">
    <next>
      <block type="controls_whileUntil">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </value>
        <statement name="DO">
          <block type="robot_if_distance">
            <field name="DISTANCE">20</field>
            <statement name="DO">
              <block type="robot_stop">
                <next>
                  <block type="robot_backward">
                    <next>
                      <block type="robot_delay">
                        <field name="TIME">500</field>
                        <next>
                          <block type="robot_turn_right">
                            <next>
                              <block type="robot_delay">
                                <field name="TIME">300</field>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="robot_forward"></block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>`;

    try {
        const xml = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, workspace);
    } catch (e) {
        console.log('No se pudo cargar ejemplo inicial');
    }
}