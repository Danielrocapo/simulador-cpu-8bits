// Pruebas manuales de instrucciones aritmeticas en Execute.
// Ejecutar testExecute() desde Google Apps Script.

function testExecute() {
  resetCPU();
  resetMemory();

  // MOV AX, 5
  Write(0x10, 0x10);
  Write(0x11, 0x01);
  Write(0x12, 0x05);

  setRegister('PC', 0x10);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.AX, 5, 'MOV AX, 5');

  // ADD AX, 3
  resetMemory();

  Write(0x20, 0x30);
  Write(0x21, 0x01);
  Write(0x22, 0x03);

  setRegister('PC', 0x20);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.AX, 8, 'ADD AX, 3');

  // SUB AX, 2
  resetMemory();

  Write(0x30, 0x32);
  Write(0x31, 0x01);
  Write(0x32, 0x02);

  setRegister('PC', 0x30);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.AX, 6, 'SUB AX, 2');

  // INC AX
  resetMemory();

  Write(0x40, 0x34);
  Write(0x41, 0x01);

  setRegister('PC', 0x40);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.AX, 7, 'INC AX');

  // DEC AX
  resetMemory();

  Write(0x50, 0x35);
  Write(0x51, 0x01);

  setRegister('PC', 0x50);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.AX, 6, 'DEC AX');

  // CMP AX, 6
  resetMemory();

  Write(0x60, 0x36);
  Write(0x61, 0x01);
  Write(0x62, 0x06);

  setRegister('PC', 0x60);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.ZF, 1, 'CMP activa ZF');

  Logger.log(
    'OPERACIONES ARITMETICAS EJECUTADAS CORRECTAMENTE'
  );
}
