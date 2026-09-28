# Manual de usuario

## Preparación

1. Abrir la hoja de Google Sheets vinculada al proyecto de Apps Script.
2. Ir a la pestaña **Simulador**.
3. Verificar que se muestren registros, flags, RAM, estado de ejecución, botones y log.

## Controles

### LOAD

Carga el programa demostrativo en RAM, reinicia la CPU y coloca el PC en 00h.

### STEP

Avanza exactamente una fase del ciclo:

```text
FETCH -> DECODE -> EXECUTE -> STORE
```

Cada pulsación actualiza la interfaz y agrega una entrada al log.

### RUN

Ejecuta automáticamente las fases hasta que se pulse PAUSE o se ejecute HLT.

### PAUSE

Detiene la ejecución continua sin borrar los registros, la RAM ni la fase actual.

### RESET

Reinicia memoria RAM, registros, flags, estado de ejecución y log.
Después de RESET debe usarse LOAD antes de ejecutar el programa.

## Elementos de la interfaz

### Registros

- PC: dirección de la siguiente posición a procesar.
- IR: opcode de la instrucción actual.
- MAR: dirección de memoria activa.
- MDR: byte transferido desde o hacia memoria.
- AX y BX: registros de propósito general.

### Flags

- ZF
- CF
- SF

### RAM

La memoria contiene 256 bytes:

- 00h-7Fh: zona visual de código.
- 80h-FFh: zona visual de datos.

La celda asociada al MAR actual se resalta en la interfaz.

### Estado de ejecución

La hoja diferencia visualmente las fases FETCH, DECODE, EXECUTE, STORE y HALT.

### Log

El log registra cronológicamente las micro-operaciones y eventos principales, por ejemplo:

```text
FETCH: PC 00h -> IR 10h
DECODE: MOV_REG_IMM
EXECUTE: MOV_REG_IMM
STORE: MOV_REG_IMM
PAUSE
RUN finalizado por HLT
```

## Programa demostrativo

El programa calcula 3 x 5 mediante sumas sucesivas.

Resultado esperado:

```text
AX = 0Fh
BX = 00h
RAM[F0h] = 0Fh
HALTED = SI
```
