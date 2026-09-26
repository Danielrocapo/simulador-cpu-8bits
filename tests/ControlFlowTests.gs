// Pruebas manuales de control de flujo.
// Ejecutar testControlFlow() desde Google Apps Script.

function testControlFlow() {
  // JMP
  resetCPU();
  resetMemory();

  Write(0x10, 0x40);
  Write(0x11, 0x80);

  setRegister('PC', 0x10);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.PC, 0x80, 'JMP cambia el PC');

  // JZ
  resetCPU();
  resetMemory();

  setFlag('ZF', 1);

  Write(0x20, 0x41);
  Write(0x21, 0x90);

  setRegister('PC', 0x20);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.PC, 0x90, 'JZ salta cuando ZF es 1');

  // JNZ
  resetCPU();
  resetMemory();

  setFlag('ZF', 0);

  Write(0x30, 0x42);
  Write(0x31, 0xA0);

  setRegister('PC', 0x30);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.PC, 0xA0, 'JNZ salta cuando ZF es 0');

  // HLT
  resetCPU();
  resetMemory();

  Write(0x40, 0xFF);

  setRegister('PC', 0x40);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.halted, true, 'HLT detiene la CPU');

  Logger.log('SALTOS Y HLT FUNCIONAN CORRECTAMENTE');
}
