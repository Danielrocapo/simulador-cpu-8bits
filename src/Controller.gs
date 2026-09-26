// Controlador del ciclo de instruccion.

/**
 * Ejecuta la fase FETCH:
 * 1. MAR <- PC
 * 2. MDR <- RAM[MAR]
 * 3. IR  <- MDR
 * 4. PC  <- PC + 1
 */
function fetchPhase() {
  setRegister('MAR', getRegister('PC'));
  setRegister('MDR', Read(getRegister('MAR')));
  setRegister('IR', getRegister('MDR'));
  setRegister('PC', getRegister('PC') + 1);
}

// Instruccion decodificada y lista para Execute.
let decodedInstruction = null;

// Escritura pendiente preparada por Execute y aplicada por Store.
let pendingWrite = null;

/**
 * Lee un byte operando desde la direccion actual del PC.
 */
function readOperandByte() {
  setRegister('MAR', getRegister('PC'));
  setRegister('MDR', Read(getRegister('MAR')));
  setRegister('PC', getRegister('PC') + 1);

  return getRegister('MDR');
}

/**
 * Ejecuta la fase DECODE.
 */
function decodePhase() {
  const opcode = getRegister('IR');
  const instructionInfo = getInstructionInfo(opcode);
  const operands = [];

  for (let i = 1; i < instructionInfo.bytes; i++) {
    operands.push(readOperandByte());
  }

  decodedInstruction = {
    opcode: opcode,
    name: instructionInfo.name,
    bytes: instructionInfo.bytes,
    operands: operands
  };

  return decodedInstruction;
}

/**
 * Ejecuta la instruccion previamente decodificada.
 * Por ahora prepara la escritura de MOV registro, inmediato.
 */
function executePhase() {
  if (!decodedInstruction) {
    throw new Error('No hay una instruccion decodificada.');
  }

  const name = decodedInstruction.name;
  const operands = decodedInstruction.operands;

  if (name === 'MOV_REG_IMM') {
    const registerName = getRegisterFromCode(operands[0]);
    const value = operands[1];

    pendingWrite = {
      type: 'register',
      target: registerName,
      value: value
    };

    return;
  }

  throw new Error('Execute todavia no implementado para: ' + name);
}

/**
 * Aplica la escritura preparada por Execute.
 */
function storePhase() {
  if (!pendingWrite) {
    return;
  }

  if (pendingWrite.type === 'register') {
    setRegister(
      pendingWrite.target,
      pendingWrite.value
    );
  }

  pendingWrite = null;
}
