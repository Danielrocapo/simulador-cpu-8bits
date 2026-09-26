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
 */
function executePhase() {
  if (!decodedInstruction) {
    throw new Error('No hay una instruccion decodificada.');
  }

  const name = decodedInstruction.name;
  const op = decodedInstruction.operands;

  pendingWrite = null;

  if (name === 'MOV_REG_IMM') {
    pendingWrite = {
      type: 'register',
      target: getRegisterFromCode(op[0]),
      value: op[1]
    };
    return;
  }

  if (name === 'MOV_REG_REG') {
    const destino = getRegisterFromCode(op[0]);
    const origen = getRegisterFromCode(op[1]);

    pendingWrite = {
      type: 'register',
      target: destino,
      value: getRegister(origen)
    };
    return;
  }

  if (name === 'ADD_REG_IMM') {
    const registro = getRegisterFromCode(op[0]);

    pendingWrite = {
      type: 'register',
      target: registro,
      value: aluADD(getRegister(registro), op[1])
    };
    return;
  }

  if (name === 'ADD_REG_REG') {
    const destino = getRegisterFromCode(op[0]);
    const origen = getRegisterFromCode(op[1]);

    pendingWrite = {
      type: 'register',
      target: destino,
      value: aluADD(
        getRegister(destino),
        getRegister(origen)
      )
    };
    return;
  }

  if (name === 'SUB_REG_IMM') {
    const registro = getRegisterFromCode(op[0]);

    pendingWrite = {
      type: 'register',
      target: registro,
      value: aluSUB(getRegister(registro), op[1])
    };
    return;
  }

  if (name === 'SUB_REG_REG') {
    const destino = getRegisterFromCode(op[0]);
    const origen = getRegisterFromCode(op[1]);

    pendingWrite = {
      type: 'register',
      target: destino,
      value: aluSUB(
        getRegister(destino),
        getRegister(origen)
      )
    };
    return;
  }

  if (name === 'INC') {
    const registro = getRegisterFromCode(op[0]);

    pendingWrite = {
      type: 'register',
      target: registro,
      value: aluINC(getRegister(registro))
    };
    return;
  }

  if (name === 'DEC') {
    const registro = getRegisterFromCode(op[0]);

    pendingWrite = {
      type: 'register',
      target: registro,
      value: aluDEC(getRegister(registro))
    };
    return;
  }

  if (name === 'CMP_REG_IMM') {
    const registro = getRegisterFromCode(op[0]);
    aluCMP(getRegister(registro), op[1]);
    return;
  }

  if (name === 'CMP_REG_REG') {
    const primero = getRegisterFromCode(op[0]);
    const segundo = getRegisterFromCode(op[1]);

    aluCMP(
      getRegister(primero),
      getRegister(segundo)
    );
    return;
  }

  throw new Error(
    'Execute todavia no implementado para: ' + name
  );
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
