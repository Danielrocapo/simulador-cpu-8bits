// Memoria principal de 8 bits
// 256 posiciones direccionables desde 0x00 hasta 0xFF.

const MEMORY_SIZE = 256;
const CODE_START = 0x00;
const CODE_END = 0x7F;
const DATA_START = 0x80;
const DATA_END = 0xFF;

let RAM = new Array(MEMORY_SIZE).fill(0);

/**
 * Reinicia toda la memoria RAM a cero.
 */
function resetMemory() {
  RAM.fill(0);
}

/**
 * Verifica que una direccion pertenezca al rango de 8 bits.
 * @param {number} address Direccion entre 0 y 255.
 */
function validateAddress(address) {
  if (!Number.isInteger(address) || address < 0 || address >= MEMORY_SIZE) {
    throw new Error('Direccion de memoria invalida: ' + address);
  }
}

/**
 * Normaliza un valor para almacenarlo como un byte de 8 bits.
 * @param {number} value Valor numerico.
 * @return {number} Valor entre 0 y 255.
 */
function normalizeByte(value) {
  if (!Number.isInteger(value)) {
    throw new Error('El valor de memoria debe ser un numero entero.');
  }

  return value & 0xFF;
}

/**
 * Devuelve una copia del estado completo de RAM.
 * Se usa para evitar modificar la memoria desde otros modulos por accidente.
 */
function getMemorySnapshot() {
  return RAM.slice();
}
