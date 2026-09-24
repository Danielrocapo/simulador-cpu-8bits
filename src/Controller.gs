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
