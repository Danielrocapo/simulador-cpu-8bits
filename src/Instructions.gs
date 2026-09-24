// Conjunto de instrucciones (ISA) de la CPU de 8 bits.

// Codigos para identificar registros.
const REGISTER_CODES = {
  0x01: 'AX',
  0x02: 'BX'
};

// Tabla de opcodes.
// bytes indica cuanto ocupa cada instruccion en memoria.
const ISA = {
  0x10: { name: 'MOV_REG_IMM', bytes: 3 },
  0x11: { name: 'MOV_REG_REG', bytes: 3 },

  0x20: { name: 'LOAD', bytes: 3 },
  0x21: { name: 'STORE', bytes: 3 },

  0x30: { name: 'ADD_REG_IMM', bytes: 3 },
  0x31: { name: 'ADD_REG_REG', bytes: 3 },

  0x32: { name: 'SUB_REG_IMM', bytes: 3 },
  0x33: { name: 'SUB_REG_REG', bytes: 3 },

  0x34: { name: 'INC', bytes: 2 },
  0x35: { name: 'DEC', bytes: 2 },

  0x36: { name: 'CMP_REG_IMM', bytes: 3 },
  0x37: { name: 'CMP_REG_REG', bytes: 3 },

  0x40: { name: 'JMP', bytes: 2 },
  0x41: { name: 'JZ', bytes: 2 },
  0x42: { name: 'JNZ', bytes: 2 },

  0xFF: { name: 'HLT', bytes: 1 }
};

/**
 * Busca la informacion asociada a un opcode.
 */
function getInstructionInfo(opcode) {
  const instruction = ISA[opcode];

  if (!instruction) {
    throw new Error(
      'Opcode desconocido: ' + toHex8(opcode)
    );
  }

  return instruction;
}

/**
 * Convierte un codigo de registro en su nombre.
 */
function getRegisterFromCode(code) {
  const registerName = REGISTER_CODES[code];

  if (!registerName) {
    throw new Error(
      'Codigo de registro desconocido: ' + toHex8(code)
    );
  }

  return registerName;
}
