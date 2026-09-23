// Unidad Aritmetico-Logica (ALU) de 8 bits.
// Primera etapa: operaciones ADD y SUB con actualizacion de banderas.

/**
 * Actualiza las banderas ZF y SF usando un resultado de 8 bits.
 * ZF = 1 cuando el resultado es cero.
 * SF = 1 cuando el bit mas significativo (bit 7) esta encendido.
 */
function updateResultFlags(result) {
  const byteResult = normalizeByte(result);

  setFlag('ZF', byteResult === 0);
  setFlag('SF', (byteResult & 0x80) !== 0);
}

/**
 * Suma dos valores de 8 bits.
 * CF se activa cuando la suma supera 255.
 */
function aluADD(left, right) {
  const a = normalizeByte(left);
  const b = normalizeByte(right);
  const rawResult = a + b;
  const result = normalizeByte(rawResult);

  setFlag('CF', rawResult > 0xFF);
  updateResultFlags(result);

  return result;
}

/**
 * Resta dos valores de 8 bits.
 * CF se activa cuando es necesario un prestamo (resultado sin signo negativo).
 */
function aluSUB(left, right) {
  const a = normalizeByte(left);
  const b = normalizeByte(right);
  const rawResult = a - b;
  const result = normalizeByte(rawResult);

  setFlag('CF', rawResult < 0);
  updateResultFlags(result);

  return result;
}
