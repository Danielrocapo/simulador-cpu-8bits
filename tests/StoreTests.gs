// Prueba del ciclo FETCH -> DECODE -> EXECUTE -> STORE.
// Ejecutar testStoreCycle() desde Google Apps Script.

function testStoreCycle() {
  resetCPU();
  resetMemory();

  pendingWrite = null;
  decodedInstruction = null;

  // MOV AX, 5
  Write(0x10, 0x10);
  Write(0x11, 0x01);
  Write(0x12, 0x05);

  setRegister('PC', 0x10);

  fetchPhase();
  decodePhase();
  executePhase();

  // Execute prepara la escritura pero aun no modifica AX.
  assertEqual(CPU.AX, 0, 'Execute prepara el resultado');

  storePhase();

  assertEqual(CPU.AX, 5, 'Store guarda 5 en AX');
  assertEqual(CPU.PC, 0x13, 'PC queda en siguiente instruccion');

  Logger.log('CICLO FETCH-DECODE-EXECUTE-STORE CORRECTO');
}
