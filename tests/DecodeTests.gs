// Prueba manual de la fase DECODE.
// Ejecutar testDecode() desde Google Apps Script.

function testDecode() {
  resetCPU();
  resetMemory();

  // MOV AX, 5
  Write(0x10, 0x10);
  Write(0x11, 0x01);
  Write(0x12, 0x05);

  setRegister('PC', 0x10);

  fetchPhase();
  const decoded = decodePhase();

  assertEqual(decoded.name, 'MOV_REG_IMM', 'Decode reconoce MOV');
  assertEqual(decoded.operands[0], 0x01, 'Primer operando es AX');
  assertEqual(decoded.operands[1], 0x05, 'Segundo operando es 5');
  assertEqual(CPU.PC, 0x13, 'PC apunta a siguiente instruccion');

  Logger.log('DECODE COMPLETADO CORRECTAMENTE');
}
