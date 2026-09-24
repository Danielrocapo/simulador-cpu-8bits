// Pruebas manuales para la tabla ISA.
// Ejecutar testInstructions() desde Google Apps Script.

function testInstructions() {
  const mov = getInstructionInfo(0x10);
  assertEqual(mov.name, 'MOV_REG_IMM', 'Opcode MOV');
  assertEqual(mov.bytes, 3, 'MOV ocupa 3 bytes');

  const inc = getInstructionInfo(0x34);
  assertEqual(inc.name, 'INC', 'Opcode INC');
  assertEqual(inc.bytes, 2, 'INC ocupa 2 bytes');

  assertEqual(getRegisterFromCode(0x01), 'AX', 'Codigo 01 = AX');
  assertEqual(getRegisterFromCode(0x02), 'BX', 'Codigo 02 = BX');

  const hlt = getInstructionInfo(0xFF);
  assertEqual(hlt.name, 'HLT', 'Opcode HLT');
  assertEqual(hlt.bytes, 1, 'HLT ocupa 1 byte');

  Logger.log('ISA VALIDADA CORRECTAMENTE');
}
