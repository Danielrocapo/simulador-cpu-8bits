# ISA del simulador

La CPU trabaja con instrucciones codificadas en memoria mediante opcodes de 8 bits.

## Registros

| Código | Registro |
|---|---|
| 01h | AX |
| 02h | BX |

## Instrucciones

| Opcode | Instrucción | Formato | Bytes | Descripción |
|---|---|---|---:|---|
| 10h | MOV_REG_IMM | MOV reg, valor | 3 | Copia un valor inmediato a un registro. |
| 11h | MOV_REG_REG | MOV reg, reg | 3 | Copia el contenido de un registro a otro. |
| 20h | LOAD | LOAD reg, [dir] | 3 | Lee una posición de RAM y prepara su escritura en un registro. |
| 21h | STORE | STORE [dir], reg | 3 | Guarda el contenido de un registro en RAM. |
| 30h | ADD_REG_IMM | ADD reg, valor | 3 | Suma un inmediato al registro. |
| 31h | ADD_REG_REG | ADD reg, reg | 3 | Suma dos registros. |
| 32h | SUB_REG_IMM | SUB reg, valor | 3 | Resta un inmediato al registro. |
| 33h | SUB_REG_REG | SUB reg, reg | 3 | Resta el segundo registro al primero. |
| 34h | INC | INC reg | 2 | Incrementa el registro en una unidad. |
| 35h | DEC | DEC reg | 2 | Decrementa el registro en una unidad. |
| 36h | CMP_REG_IMM | CMP reg, valor | 3 | Compara un registro con un inmediato actualizando flags. |
| 37h | CMP_REG_REG | CMP reg, reg | 3 | Compara dos registros actualizando flags. |
| 40h | JMP | JMP dir | 2 | Salto incondicional. |
| 41h | JZ | JZ dir | 2 | Salta si ZF = 1. |
| 42h | JNZ | JNZ dir | 2 | Salta si ZF = 0. |
| FFh | HLT | HLT | 1 | Detiene la CPU. |

## Banderas

- **ZF (Zero Flag):** vale 1 cuando el resultado es cero.
- **CF (Carry Flag):** vale 1 cuando existe acarreo o préstamo en una operación aritmética.
- **SF (Sign Flag):** refleja el bit más significativo del resultado de 8 bits.

## Ciclo de instrucción

Cada instrucción pasa por las fases:

```text
FETCH -> DECODE -> EXECUTE -> STORE
```

HLT finaliza la ejecución y lleva el simulador al estado HALT.
