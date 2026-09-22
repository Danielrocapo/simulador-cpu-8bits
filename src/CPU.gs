// Estado principal de la CPU simulada de 8 bits.

const CPU = {
  PC: 0x00,
  IR: 0x00,
  MAR: 0x00,
  MDR: 0x00,
  AX: 0x00,
  BX: 0x00,
  ZF: 0,
  CF: 0,
  SF: 0,
  halted: false
};

const BYTE_REGISTERS = ['PC', 'IR', 'MAR', 'MDR', 'AX', 'BX'];
const FLAG_REGISTERS = ['ZF', 'CF', 'SF'];

/**
 * Restaura los registros y banderas al estado inicial.
 */
function resetCPU() {
  BYTE_REGISTERS.forEach(function(registerName) {
    CPU[registerName] = 0x00;
  });

  FLAG_REGISTERS.forEach(function(flagName) {
    CPU[flagName] = 0;
  });

  CPU.halted = false;
}

/**
 * Lee un registro visible de la CPU.
 */
function getRegister(registerName) {
  validateRegisterName(registerName);
  return CPU[registerName];
}

/**
 * Escribe un valor en un registro de 8 bits.
 */
function setRegister(registerName, value) {
  if (BYTE_REGISTERS.indexOf(registerName) === -1) {
    throw new Error('Registro de 8 bits invalido: ' + registerName);
  }

  CPU[registerName] = normalizeByte(value);
}

/**
 * Actualiza una bandera de estado con 0 o 1.
 */
function setFlag(flagName, value) {
  if (FLAG_REGISTERS.indexOf(flagName) === -1) {
    throw new Error('Bandera invalida: ' + flagName);
  }

  CPU[flagName] = value ? 1 : 0;
}

/**
 * Valida que el nombre corresponda a un registro o bandera conocida.
 */
function validateRegisterName(registerName) {
  const valid = BYTE_REGISTERS.indexOf(registerName) !== -1 ||
                FLAG_REGISTERS.indexOf(registerName) !== -1;

  if (!valid) {
    throw new Error('Registro desconocido: ' + registerName);
  }
}

/**
 * Entrega una copia del estado actual para mostrarla en la interfaz.
 */
function getCPUState() {
  return Object.assign({}, CPU);
}
