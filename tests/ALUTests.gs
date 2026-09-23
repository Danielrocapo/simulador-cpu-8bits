// Pruebas manuales para el modulo ALU.gs.
// Ejecutar testALU() desde Google Apps Script.

function testALU() {
  resetCPU();

  // ADD: 250 + 10 = 260, pero en 8 bits queda 4 y activa Carry.
  assertEqual(aluADD(250, 10), 4, 'ADD con acarreo');
  assertEqual(CPU.CF, 1, 'CF despues de ADD con acarreo');
  assertEqual(CPU.ZF, 0, 'ZF despues de ADD');

  // SUB: resultado cero activa ZF.
  assertEqual(aluSUB(5, 5), 0, 'SUB con resultado cero');
  assertEqual(CPU.ZF, 1, 'ZF despues de SUB igual');
  assertEqual(CPU.CF, 0, 'CF despues de SUB sin prestamo');

  // INC: 255 + 1 vuelve a 0 en 8 bits.
  assertEqual(aluINC(255), 0, 'INC con desbordamiento');
  assertEqual(CPU.CF, 1, 'CF despues de INC 255');
  assertEqual(CPU.ZF, 1, 'ZF despues de INC 255');

  // DEC: 0 - 1 se representa como 255.
  assertEqual(aluDEC(0), 255, 'DEC desde cero');
  assertEqual(CPU.CF, 1, 'CF despues de DEC 0');
  assertEqual(CPU.SF, 1, 'SF despues de DEC 0');

  // CMP no devuelve ni almacena resultado, solo actualiza banderas.
  aluCMP(7, 7);
  assertEqual(CPU.ZF, 1, 'CMP de valores iguales');

  aluCMP(3, 5);
  assertEqual(CPU.CF, 1, 'CMP con prestamo');
  assertEqual(CPU.SF, 1, 'SF despues de CMP negativo en 8 bits');

  // Operaciones logicas.
  assertEqual(aluAND(0xF0, 0x0F), 0x00, 'AND bit a bit');
  assertEqual(CPU.ZF, 1, 'ZF despues de AND igual a cero');

  assertEqual(aluOR(0x80, 0x01), 0x81, 'OR bit a bit');
  assertEqual(CPU.SF, 1, 'SF despues de OR con bit 7 activo');

  assertEqual(aluXOR(0xAA, 0xFF), 0x55, 'XOR bit a bit');
  assertEqual(CPU.SF, 0, 'SF despues de XOR');

  assertEqual(aluNOT(0x00), 0xFF, 'NOT de cero');
  assertEqual(CPU.SF, 1, 'SF despues de NOT');

  Logger.log('Todas las pruebas de ALU pasaron correctamente.');
}
