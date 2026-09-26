const SIMULATOR_SHEET = 'Simulador';

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
    decodedInstruction
      ? decodedInstruction.name
      : '-';

  sheet.getRange('B12').setValue(phase);
  sheet.getRange('B13').setValue(instruction);
  sheet.getRange('B14').setValue(cpu.halted ? 'SI' : 'NO');

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
  const marRow = Math.floor(mar / 16);
  const marCol = mar % 16;

  sheet
    .getRange(3 + marRow, 8 + marCol)
    .setBackground('#FFD966')
    .setFontWeight('bold');
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
