// Prueba integrada del programa demostrativo.
// Ejecutar testProgram() desde Google Apps Script.

function testProgram() {
  resetCPU();
  resetMemory();

  decodedInstruction = null;
  pendingWrite = null;

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

  let ciclos = 0;

  while (!CPU.halted && ciclos < 100) {
    fetchPhase();
    decodePhase();
    executePhase();
    storePhase();

    ciclos++;
  }

  assertEqual(CPU.AX, 15, 'AX termina en 15');
  assertEqual(CPU.BX, 0, 'BX termina en 0');
  assertEqual(Read(0xF0), 15, 'Resultado guardado en F0h');
  assertEqual(CPU.halted, true, 'Programa termina con HLT');

  Logger.log('Ciclos ejecutados: ' + ciclos);
  Logger.log('PROGRAMA COMPLETO EJECUTADO CORRECTAMENTE');
}
