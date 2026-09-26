// Prueba manual de LOAD y STORE.
// Ejecutar testLoadStore() desde Google Apps Script.

function testLoadStore() {
  resetCPU();
  resetMemory();

  pendingWrite = null;
  decodedInstruction = null;

  Write(0xF0, 9);

  // LOAD AX, [F0h]
  Write(0x70, 0x20);
  Write(0x71, 0x01);
  Write(0x72, 0xF0);

  // STORE [F1h], AX
  Write(0x73, 0x21);
  Write(0x74, 0xF1);
  Write(0x75, 0x01);

  setRegister('PC', 0x70);

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(CPU.AX, 9, 'LOAD trae 9 desde memoria');

  fetchPhase();
  decodePhase();
  executePhase();
  storePhase();

  assertEqual(Read(0xF1), 9, 'STORE guarda AX en memoria');

  Logger.log('LOAD Y STORE FUNCIONAN CORRECTAMENTE');
}
