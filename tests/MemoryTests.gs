// Pruebas manuales para el modulo Memory.gs.
// Ejecutar testMemory() desde Google Apps Script.

function testMemory() {
  resetMemory();

  // Escritura y lectura basicas.
  Write(0x10, 42);
  assertEqual(Read(0x10), 42, 'Read/Write basico');

  // Los valores deben mantenerse en 8 bits.
  Write(0x20, 300);
  assertEqual(Read(0x20), 44, 'Normalizacion de 300 a 8 bits');

  // Formatos de visualizacion.
  assertEqual(toHex8(255), 'FFh', 'Formato hexadecimal');
  assertEqual(toBinary8(5), '00000101', 'Formato binario');

  // Segmentacion logica elegida para el simulador.
  assertEqual(inspectMemory(0x40).segment, 'CODE', 'Segmento de codigo');
  assertEqual(inspectMemory(0xF0).segment, 'DATA', 'Segmento de datos');

  Logger.log('Todas las pruebas de memoria pasaron correctamente.');
}

function assertEqual(actual, expected, testName) {
  if (actual !== expected) {
    throw new Error(
      'Fallo en ' + testName + ': esperado=' + expected + ', actual=' + actual
    );
  }

  Logger.log('OK - ' + testName);
}
