// Prueba manual de la fase FETCH.
// Ejecutar testFetch() desde Google Apps Script.

function testFetch() {
  resetCPU();
  resetMemory();

  // Instruccion de prueba en la direccion 10h.
  Write(0x10, 0x05);

  // La siguiente instruccion se encuentra en 10h.
  setRegister('PC', 0x10);

  fetchPhase();

  assertEqual(CPU.MAR, 0x10, 'MAR recibe el valor de PC');
  assertEqual(CPU.MDR, 0x05, 'MDR recibe el dato de memoria');
  assertEqual(CPU.IR, 0x05, 'IR recibe el contenido de MDR');
  assertEqual(CPU.PC, 0x11, 'PC avanza a la siguiente direccion');

  Logger.log('FETCH COMPLETADO CORRECTAMENTE');
}
