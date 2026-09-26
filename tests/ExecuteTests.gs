// Prueba manual de la fase EXECUTE.
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

  assertEqual(CPU.AX, 5, 'Execute guarda 5 en AX');
  assertEqual(CPU.PC, 0x13, 'PC permanece en siguiente instruccion');

  Logger.log('EXECUTE COMPLETADO CORRECTAMENTE');
}
