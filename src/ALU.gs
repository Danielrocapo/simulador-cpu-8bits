// Unidad Aritmetico-Logica (ALU) de 8 bits.
// Operaciones aritmeticas iniciales y actualizacion de banderas.

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
 * CF se activa cuando es necesario un prestamo.
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

/**
 * Incrementa un valor de 8 bits en una unidad.
 * Reutiliza ADD para mantener el mismo manejo de banderas.
 */
function aluINC(value) {
  return aluADD(value, 1);
}

/**
 * Decrementa un valor de 8 bits en una unidad.
 * Reutiliza SUB para mantener el mismo manejo de banderas.
 */
function aluDEC(value) {
  return aluSUB(value, 1);
}

/**
 * Compara dos valores como una resta sin guardar el resultado.
 * Solo actualiza ZF, CF y SF.
 */
function aluCMP(left, right) {
  aluSUB(left, right);
}
