# Pruebas realizadas

Las pruebas se ejecutaron manualmente desde Google Apps Script antes de registrar cada bloque funcional en el repositorio.

## Memoria

Archivo: `tests/MemoryTests.gs`

Se validó lectura y escritura, normalización a 8 bits, direcciones 00h-FFh, representación hexadecimal/binaria y segmentación CODE/DATA.

## ALU

Archivo: `tests/ALUTests.gs`

Se validaron ADD, SUB, INC, DEC, CMP, AND, OR, XOR, NOT y las banderas ZF, CF y SF.

## Fetch

Archivo: `tests/FetchTests.gs`

Caso:

```text
PC = 10h
RAM[10h] = 05h
```

Resultado:

```text
MAR = 10h
MDR = 05h
IR  = 05h
PC  = 11h
```

## Decode

Archivo: `tests/DecodeTests.gs`

Se probó MOV AX, 5. Decode reconoció MOV_REG_IMM, identificó los operandos y dejó el PC en la siguiente instrucción.

## Execute y Store

Archivos:

- `tests/ExecuteTests.gs`
- `tests/StoreTests.gs`
- `tests/LoadStoreTests.gs`

Se validaron MOV, ADD, SUB, INC, DEC, CMP, LOAD y STORE.

## Control de flujo

Archivo: `tests/ControlFlowTests.gs`

Se validaron JMP, JZ, JNZ y HLT.

## Programa integrado

Archivo: `tests/ProgramTests.gs`

```asm
MOV AX, 0
MOV BX, 5

LOOP:
ADD AX, 3
DEC BX
CMP BX, 0
JNZ LOOP

STORE [F0h], AX
HLT
```

Resultado comprobado:

```text
AX = 15
BX = 0
RAM[F0h] = 15
CPU detenida
```

La prueba integrada completó 24 ciclos de instrucción.

## Interfaz y controles

Se comprobó manualmente en Google Sheets:

- LOAD
- STEP
- RUN
- PAUSE
- RESET
- actualización visual de registros y RAM
- resaltado de fase
- resaltado del MAR
- conservación del estado durante PAUSE
- finalización en HALT
- log cronológico de micro-operaciones
