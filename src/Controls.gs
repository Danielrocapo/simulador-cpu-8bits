const SIM_STATE_KEY = 'SIMULATOR_STATE';
const RUN_STATE_KEY = 'SIMULATOR_RUNNING';

let currentPhase = 'FETCH';

function saveSimulatorState() {
  const state = {
    cpu: getCPUState(),
    ram: getMemorySnapshot(),
    currentPhase: currentPhase,
    decodedInstruction: decodedInstruction,
    pendingWrite: pendingWrite
  };

  PropertiesService
    .getDocumentProperties()
    .setProperty(
      SIM_STATE_KEY,
      JSON.stringify(state)
    );
}

function loadSimulatorState() {
  const raw = PropertiesService
    .getDocumentProperties()
    .getProperty(SIM_STATE_KEY);

  if (!raw) {
    return;
  }

  const state = JSON.parse(raw);

  Object.assign(CPU, state.cpu);
  RAM = state.ram.slice();

  currentPhase =
    state.currentPhase || 'FETCH';

  decodedInstruction =
    state.decodedInstruction || null;

  pendingWrite =
    state.pendingWrite || null;
}

function setRunning(running) {
  PropertiesService
    .getDocumentProperties()
    .setProperty(
      RUN_STATE_KEY,
      running ? '1' : '0'
    );
}

function isRunning() {
  return PropertiesService
    .getDocumentProperties()
    .getProperty(RUN_STATE_KEY) === '1';
}

function loadDemoProgram() {
  setRunning(false);

  resetCPU();
  resetMemory();

  decodedInstruction = null;
  pendingWrite = null;
  currentPhase = 'FETCH';

  // MOV AX, 0
  Write(0x00, 0x10);
  Write(0x01, 0x01);
  Write(0x02, 0x00);

  // MOV BX, 5
  Write(0x03, 0x10);
  Write(0x04, 0x02);
  Write(0x05, 0x05);

  // ADD AX, 3
  Write(0x06, 0x30);
  Write(0x07, 0x01);
  Write(0x08, 0x03);

  // DEC BX
  Write(0x09, 0x35);
  Write(0x0A, 0x02);

  // CMP BX, 0
  Write(0x0B, 0x36);
  Write(0x0C, 0x02);
  Write(0x0D, 0x00);

  // JNZ 06h
  Write(0x0E, 0x42);
  Write(0x0F, 0x06);

  // STORE [F0h], AX
  Write(0x10, 0x21);
  Write(0x11, 0xF0);
  Write(0x12, 0x01);

  // HLT
  Write(0x13, 0xFF);

  setRegister('PC', 0x00);

  clearMicroLog();
  appendMicroLog('Programa demostrativo cargado');

  saveSimulatorState();
  renderSimulatorUI();
}

function stepSimulator() {
  loadSimulatorState();

  if (CPU.halted) {
    appendMicroLog(
      'CPU detenida: no se puede continuar'
    );

    renderSimulatorUI();
    return;
  }

  if (currentPhase === 'FETCH') {
    const pcAnterior = getRegister('PC');

    fetchPhase();

    appendMicroLog(
      'FETCH: PC ' +
      toHex8(pcAnterior) +
      ' -> IR ' +
      toHex8(getRegister('IR'))
    );

    currentPhase = 'DECODE';
  }

  else if (currentPhase === 'DECODE') {
    const decoded = decodePhase();

    appendMicroLog(
      'DECODE: ' + decoded.name
    );

    currentPhase = 'EXECUTE';
  }

  else if (currentPhase === 'EXECUTE') {
    executePhase();

    appendMicroLog(
      'EXECUTE: ' +
      decodedInstruction.name
    );

    currentPhase = 'STORE';
  }

  else if (currentPhase === 'STORE') {
    const instructionName =
      decodedInstruction
        ? decodedInstruction.name
        : '-';

    storePhase();

    appendMicroLog(
      'STORE: ' + instructionName
    );

    currentPhase = 'FETCH';
  }

  saveSimulatorState();
  renderSimulatorUI();

  SpreadsheetApp.flush();
}

function runSimulator() {
  loadSimulatorState();

  if (Read(getRegister('PC')) === 0x00) {
    appendMicroLog(
      'No hay programa cargado. Use LOAD primero.'
    );

    renderSimulatorUI();
    return;
  }

  if (CPU.halted) {
    appendMicroLog(
      'CPU detenida. Use LOAD o RESET.'
    );

    renderSimulatorUI();
    return;
  }

  setRunning(true);
  appendMicroLog('RUN iniciado');

  while (isRunning()) {
    loadSimulatorState();

    if (CPU.halted) {
      setRunning(false);
      appendMicroLog('RUN finalizado por HLT');
      renderSimulatorUI();
      break;
    }

    stepSimulator();
    Utilities.sleep(300);
  }
}

function pauseSimulator() {
  setRunning(false);

  loadSimulatorState();

  appendMicroLog('PAUSE');

  renderSimulatorUI();

  SpreadsheetApp.flush();
}

function resetSimulator() {
  setRunning(false);

  resetCPU();
  resetMemory();

  decodedInstruction = null;
  pendingWrite = null;
  currentPhase = 'FETCH';

  clearMicroLog();
  appendMicroLog('Simulador reiniciado');

  saveSimulatorState();
  renderSimulatorUI();
}
