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
 * Lee una posicion de memoria.
 * @param {number} address Direccion entre 0 y 255.
 * @return {number} Byte almacenado en la direccion.
 */
function Read(address) {
  validateAddress(address);
  return RAM[address];
}

/**
 * Escribe un byte en una posicion de memoria.
 * @param {number} address Direccion entre 0 y 255.
 * @param {number} value Valor a almacenar.
 */
function Write(address, value) {
  validateAddress(address);
  RAM[address] = normalizeByte(value);
}

/**
 * Convierte una direccion o byte a hexadecimal de dos digitos.
 */
function toHex8(value) {
  return normalizeByte(value).toString(16).toUpperCase().padStart(2, '0') + 'h';
}

/**
 * Convierte un byte a binario de ocho bits.
 */
function toBinary8(value) {
  return normalizeByte(value).toString(2).padStart(8, '0');
}

/**
 * Devuelve una fila preparada para mostrar una celda de memoria.
 */
function inspectMemory(address) {
  const value = Read(address);

  return {
    address: address,
    addressHex: toHex8(address),
    decimal: value,
    hexadecimal: toHex8(value),
    binary: toBinary8(value),
    segment: address <= CODE_END ? 'CODE' : 'DATA'
  };
}

/**
 * Devuelve una copia del estado completo de RAM.
 * Se usa para evitar modificar la memoria desde otros modulos por accidente.
 */
function getMemorySnapshot() {
  return RAM.slice();
}
