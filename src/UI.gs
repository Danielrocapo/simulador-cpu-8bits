const SIMULATOR_SHEET = 'Simulador';
const SELECTED_MEMORY_ADDRESS_KEY = 'SELECTED_MEMORY_ADDRESS';

function getSimulatorSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error('El proyecto debe estar vinculado a una hoja de Google Sheets.');
  }

  let sheet = ss.getSheetByName(SIMULATOR_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(SIMULATOR_SHEET);
  }

  return sheet;
}

function setupSimulatorUI() {
  const sheet = getSimulatorSheet();

  sheet.getRange('A1:W60').breakApart();
  sheet.getRange('A1:W60').clear();

  sheet.setColumnWidths(1, 23, 70);
  sheet.setColumnWidth(1, 110);
  sheet.setColumnWidth(2, 150);

  sheet.getRange('A1:E1').merge();
  sheet.getRange('A1')
    .setValue('SIMULADOR CPU DE 8 BITS')
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');

  sheet.getRange('A3:B3').merge();
  sheet.getRange('A3')
    .setValue('REGISTROS')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange(4, 1, 6, 1).setValues([
    ['PC'], ['IR'], ['MAR'], ['MDR'], ['AX'], ['BX']
  ]);
  sheet.getRange('A4:A9').setFontWeight('bold');

  sheet.getRange('D3:E3').merge();
  sheet.getRange('D3')
    .setValue('FLAGS')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('D4:D6').setValues([
    ['ZF'], ['CF'], ['SF']
  ]);
  sheet.getRange('D4:D6').setFontWeight('bold');

  sheet.getRange('A11:E11').merge();
  sheet.getRange('A11')
    .setValue('ESTADO DE EJECUCIÓN')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A12:A14').setValues([
    ['FASE'], ['INSTRUCCIÓN'], ['HALTED']
  ]);
  sheet.getRange('A12:A14').setFontWeight('bold');

  sheet.getRange('A15:E15').setValues([[
    'FETCH', 'DECODE', 'EXECUTE', 'STORE', 'HALT'
  ]]);

  sheet.getRange('A15').setBackground('#FFF2CC');
  sheet.getRange('B15').setBackground('#D9EAF7');
  sheet.getRange('C15').setBackground('#FCE5CD');
  sheet.getRange('D15').setBackground('#D9EAD3');
  sheet.getRange('E15').setBackground('#F4CCCC');

  sheet.getRange('A15:E15')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('H1:W1').merge();
  sheet.getRange('H1')
    .setValue('MEMORIA RAM - 256 BYTES')
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = [];
  for (let i = 0; i < 16; i++) {
    headers.push(i.toString(16).toUpperCase());
  }
  sheet.getRange(2, 8, 1, 16).setValues([headers]);
  sheet.getRange(2, 8, 1, 16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  const rowHeaders = [];
  for (let row = 0; row < 16; row++) {
    rowHeaders.push([
      (row * 16).toString(16).toUpperCase().padStart(2, '0')
    ]);
  }
  sheet.getRange(3, 7, 16, 1).setValues(rowHeaders);
  sheet.getRange(3, 7, 16, 1).setFontWeight('bold');

  sheet.getRange('A17:E17').setValues([[
    'LOAD', 'STEP', 'RUN', 'PAUSE', 'RESET'
  ]]);
  sheet.getRange('A17:E17')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A18').setValue('DELAY RUN (ms)');
  sheet.getRange('B18').setValue(300);

  const delayValidation = SpreadsheetApp
    .newDataValidation()
    .requireNumberBetween(50, 2000)
    .setAllowInvalid(false)
    .build();

  sheet.getRange('B18').setDataValidation(delayValidation);

  // Inspector de memoria: permite revisar cualquier celda de RAM
  // en hexadecimal, decimal, binario y con una interpretación mnemónica.
  sheet.getRange('H20:W20').merge();
  sheet.getRange('H20')
    .setValue('INSPECTOR DE MEMORIA')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('H21').setValue('Dirección');
  sheet.getRange('J21').setValue('Hex');
  sheet.getRange('L21').setValue('Decimal');
  sheet.getRange('N21').setValue('Binario');
  sheet.getRange('Q21').setValue('Mnemónico');

  sheet.getRange('H21').setFontWeight('bold');
  sheet.getRange('J21').setFontWeight('bold');
  sheet.getRange('L21').setFontWeight('bold');
  sheet.getRange('N21').setFontWeight('bold');
  sheet.getRange('Q21').setFontWeight('bold');

  sheet.getRange('O21:P21').merge();
  sheet.getRange('R21:W21').merge();
  sheet.getRange('H22:W22').merge();
  sheet.getRange('H22')
    .setValue('Selecciona una celda de RAM para inspeccionarla.')
    .setHorizontalAlignment('center');

  sheet.getRange('A20:F20').merge();
  sheet.getRange('A20')
    .setValue('LOG DE MICRO-OPERACIONES')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A21:B21').setValues([[
    'Hora', 'Micro-operación'
  ]]);
  sheet.getRange('A21:B21').setFontWeight('bold');
  sheet.setColumnWidth(2, 400);

  renderSimulatorUI();
  appendMicroLog('Interfaz del simulador inicializada');
}

function renderSimulatorUI() {
  const sheet = getSimulatorSheet();
  const cpu = getCPUState();

  sheet.getRange('B4:B9').setValues([
    [toHex8(cpu.PC)],
    [toHex8(cpu.IR)],
    [toHex8(cpu.MAR)],
    [toHex8(cpu.MDR)],
    [toHex8(cpu.AX)],
    [toHex8(cpu.BX)]
  ]);

  sheet.getRange('E4:E6').setValues([
    [cpu.ZF], [cpu.CF], [cpu.SF]
  ]);

  const phase =
    typeof currentPhase !== 'undefined'
      ? currentPhase
      : 'FETCH';

  const instruction =
    formatDecodedInstruction(decodedInstruction);

  sheet.getRange('B12').setValue(phase);
  sheet.getRange('B13').setValue(instruction);
  sheet.getRange('B14').setValue(cpu.halted ? 'SI' : 'NO');

  sheet.getRange('A16:E16').breakApart();
  sheet.getRange('A16:E16').merge();

  sheet.getRange('A16')
    .setValue('ACCIÓN ACTUAL: ' + getPhaseDescription(phase))
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBackground('#F3F3F3');

  const phaseColors = {
    FETCH: '#FFF2CC',
    DECODE: '#D9EAF7',
    EXECUTE: '#FCE5CD',
    STORE: '#D9EAD3',
    HALT: '#F4CCCC'
  };

  sheet.getRange('B12')
    .setBackground(
      phaseColors[phase] || '#FFFFFF'
    )
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('B13')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('B14')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  if (cpu.halted) {
    sheet.getRange('B14').setBackground('#F4CCCC');
  } else {
    sheet.getRange('B14').setBackground('#D9EAD3');
  }

  const memoryValues = [];

  for (let row = 0; row < 16; row++) {
    const currentRow = [];

    for (let col = 0; col < 16; col++) {
      const address = row * 16 + col;
      currentRow.push(toHex8(Read(address)));
    }

    memoryValues.push(currentRow);
  }

  sheet
    .getRange(3, 8, 16, 16)
    .setValues(memoryValues)
    .setHorizontalAlignment('center');

  sheet
    .getRange(3, 8, 8, 16)
    .setBackground('#D9EAF7');

  sheet
    .getRange(11, 8, 8, 16)
    .setBackground('#E2F0D9');

  const mar = cpu.MAR;
  const pc = cpu.PC;

  const marRow = Math.floor(mar / 16);
  const marCol = mar % 16;

  const pcRow = Math.floor(pc / 16);
  const pcCol = pc % 16;

  sheet
    .getRange(3 + pcRow, 8 + pcCol)
    .setBackground('#F4CCCC')
    .setFontWeight('bold');

  sheet
    .getRange(3 + marRow, 8 + marCol)
    .setBackground('#FFD966')
    .setFontWeight('bold');

  if (pc === mar) {
    sheet
      .getRange(3 + marRow, 8 + marCol)
      .setBackground('#F6B26B');
  }

  renderMemoryInspector(getSelectedMemoryAddress());
}

function getSelectedMemoryAddress() {
  const raw = PropertiesService
    .getDocumentProperties()
    .getProperty(SELECTED_MEMORY_ADDRESS_KEY);

  if (raw === null) {
    return getRegister('MAR');
  }

  const address = Number(raw);

  if (
    !Number.isInteger(address) ||
    address < 0 ||
    address >= MEMORY_SIZE
  ) {
    return getRegister('MAR');
  }

  return address;
}

function setSelectedMemoryAddress(address) {
  validateAddress(address);

  PropertiesService
    .getDocumentProperties()
    .setProperty(
      SELECTED_MEMORY_ADDRESS_KEY,
      String(address)
    );
}

function getMemoryMnemonic(address) {
  validateAddress(address);

  if (address >= DATA_START) {
    return 'DATO';
  }

  let cursor = CODE_START;

  while (cursor <= CODE_END) {
    const opcode = Read(cursor);

    if (opcode === 0x00) {
      break;
    }

    const info = ISA[opcode];

    if (!info) {
      break;
    }

    if (address === cursor) {
      return info.name;
    }

    if (
      address > cursor &&
      address < cursor + info.bytes
    ) {
      return 'OPERANDO';
    }

    if (opcode === 0xFF) {
      break;
    }

    cursor += info.bytes;
  }

  return address <= CODE_END
    ? 'LIBRE / DATO'
    : 'DATO';
}

function renderMemoryInspector(address) {
  validateAddress(address);

  const sheet = getSimulatorSheet();
  const info = inspectMemory(address);

  sheet.getRange('I21').setValue(info.addressHex);
  sheet.getRange('K21').setValue(info.hexadecimal);
  sheet.getRange('M21').setValue(info.decimal);
  sheet.getRange('O21').setValue(info.binary);
  sheet.getRange('R21').setValue(
    getMemoryMnemonic(address)
  );

  sheet.getRange('I21:W21')
    .setVerticalAlignment('middle');
}

function onSelectionChange(e) {
  if (!e || !e.range) {
    return;
  }

  const range = e.range;
  const sheet = range.getSheet();

  if (sheet.getName() !== SIMULATOR_SHEET) {
    return;
  }

  const row = range.getRow();
  const col = range.getColumn();

  const isMemoryCell =
    row >= 3 &&
    row <= 18 &&
    col >= 8 &&
    col <= 23;

  if (!isMemoryCell) {
    return;
  }

  const address =
    (row - 3) * 16 +
    (col - 8);

  setSelectedMemoryAddress(address);
  renderMemoryInspector(address);
}

function formatDecodedInstruction(inst) {
  if (!inst) {
    return '-';
  }

  const op = inst.operands || [];

  if (inst.name === 'MOV_REG_IMM') {
    return 'MOV ' + getRegisterFromCode(op[0]) + ', ' + op[1];
  }

  if (inst.name === 'MOV_REG_REG') {
    return 'MOV ' +
      getRegisterFromCode(op[0]) + ', ' +
      getRegisterFromCode(op[1]);
  }

  if (inst.name === 'LOAD') {
    return 'LOAD ' +
      getRegisterFromCode(op[0]) +
      ', [' + toHex8(op[1]) + ']';
  }

  if (inst.name === 'STORE') {
    return 'STORE [' +
      toHex8(op[0]) +
      '], ' +
      getRegisterFromCode(op[1]);
  }

  if (inst.name === 'ADD_REG_IMM') {
    return 'ADD ' + getRegisterFromCode(op[0]) + ', ' + op[1];
  }

  if (inst.name === 'ADD_REG_REG') {
    return 'ADD ' +
      getRegisterFromCode(op[0]) + ', ' +
      getRegisterFromCode(op[1]);
  }

  if (inst.name === 'SUB_REG_IMM') {
    return 'SUB ' + getRegisterFromCode(op[0]) + ', ' + op[1];
  }

  if (inst.name === 'SUB_REG_REG') {
    return 'SUB ' +
      getRegisterFromCode(op[0]) + ', ' +
      getRegisterFromCode(op[1]);
  }

  if (inst.name === 'INC') {
    return 'INC ' + getRegisterFromCode(op[0]);
  }

  if (inst.name === 'DEC') {
    return 'DEC ' + getRegisterFromCode(op[0]);
  }

  if (inst.name === 'CMP_REG_IMM') {
    return 'CMP ' + getRegisterFromCode(op[0]) + ', ' + op[1];
  }

  if (inst.name === 'CMP_REG_REG') {
    return 'CMP ' +
      getRegisterFromCode(op[0]) + ', ' +
      getRegisterFromCode(op[1]);
  }

  if (inst.name === 'JMP' ||
      inst.name === 'JZ' ||
      inst.name === 'JNZ') {
    return inst.name + ' ' + toHex8(op[0]);
  }

  if (inst.name === 'HLT') {
    return 'HLT';
  }

  return inst.name;
}

function getPhaseDescription(phase) {
  const descriptions = {
    FETCH: 'Buscando la siguiente instrucción en memoria',
    DECODE: 'Interpretando la instrucción y sus operandos',
    EXECUTE: 'Ejecutando la operación',
    STORE: 'Guardando el resultado',
    HALT: 'Programa finalizado'
  };

  return descriptions[phase] || '';
}

function beautifySimulatorUI() {
  const sheet = getSimulatorSheet();

  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(1);

  sheet.getRange('A1:E1')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  sheet.getRange('H1:W1')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  sheet.getRange('A3:B3')
    .setBackground('#D9EAF7')
    .setFontWeight('bold');

  sheet.getRange('A4:B9')
    .setBorder(true, true, true, true, true, true);

  sheet.getRange('B4:B9')
    .setHorizontalAlignment('center')
    .setFontFamily('Roboto Mono');

  sheet.getRange('D3:E3')
    .setBackground('#D9EAF7')
    .setFontWeight('bold');

  sheet.getRange('D4:E6')
    .setBorder(true, true, true, true, true, true);

  sheet.getRange('A11:E11')
    .setBackground('#D9EAF7')
    .setFontWeight('bold');

  sheet.getRange('A12:B14')
    .setBorder(true, true, true, true, true, true);

  sheet.getRange('H2:W18')
    .setFontFamily('Roboto Mono')
    .setFontSize(9);

  sheet.getRange('H20:W20')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF');

  sheet.getRange('H21:W22')
    .setBorder(true, true, true, true, true, true);

  sheet.getRange('I21:W21')
    .setFontFamily('Roboto Mono')
    .setHorizontalAlignment('center');

  sheet.getRange('H22:W22')
    .setBackground('#F3F3F3')
    .setFontStyle('italic');

  sheet.getRange('A18:B18')
    .setBorder(true, true, true, true, true, true);

  sheet.getRange('A18')
    .setBackground('#D9EAF7')
    .setFontWeight('bold');

  sheet.getRange('B18')
    .setHorizontalAlignment('center')
    .setFontWeight('bold');

  sheet.getRange('A20:F20')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF');

  sheet.getRange('A21:B60')
    .setBorder(true, true, true, true, true, true);

  renderSimulatorUI();
}

function appendMicroLog(message) {
  const sheet = getSimulatorSheet();

  let row = 22;

  while (
    row <= 60 &&
    sheet.getRange(row, 1).getValue() !== ''
  ) {
    row++;
  }

  if (row > 60) {
    sheet.getRange('A22:B60').clearContent();
    row = 22;
  }

  sheet.getRange(row, 1).setValue(
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'HH:mm:ss'
    )
  );

  sheet.getRange(row, 2).setValue(message);
}

function clearMicroLog() {
  const sheet = getSimulatorSheet();
  sheet.getRange('A22:B60').clearContent();
}
