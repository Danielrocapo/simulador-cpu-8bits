# Simulador de CPU de 8 bits

Proyecto de Arquitectura de Computadoras orientado a la simulación visual de una CPU de 8 bits basada en arquitectura von Neumann y una memoria principal de 256 bytes.

## Objetivo

Construir un simulador interactivo en Google Sheets + Google Apps Script que permita observar el ciclo completo de instrucción:

1. Fetch
2. Decode
3. Execute
4. Store

El simulador mostrará de forma visible los registros internos, la memoria RAM, las banderas de estado, la ALU y un registro cronológico de micro-operaciones.

## Componentes previstos

- RAM de 256 posiciones: 00h a FFh.
- Registros PC, IR, MAR, MDR, AX y BX.
- Flags ZF, CF y SF.
- ALU de 8 bits.
- Segmento de código y segmento de datos.
- Operaciones primitivas Read(address) y Write(address, value).
- Ejecución paso a paso.
- Ejecución continua.
- Controles STEP, RUN, PAUSE, RESET y LOAD PROGRAM.
- Log de micro-operaciones.

## ISA mínima

### Transferencia
- MOV
- LOAD
- STORE

### Aritmética y lógica
- ADD
- SUB
- INC
- DEC
- CMP

### Control de flujo
- JMP
- JZ
- JNZ
- HLT

## Estructura prevista

```text
src/
  CPU.gs
  Memory.gs
  ALU.gs
  Instructions.gs
  Controller.gs
  UI.gs

docs/
  arquitectura.md
  isa.md
  pruebas.md

examples/
  programa_demo.asm
```

## Estado del desarrollo

Proyecto inicializado. La primera etapa corresponde al diseño de la arquitectura, definición de módulos y planificación del desarrollo antes de implementar la lógica del simulador.
