; Programa demostrativo
; Calcula 3 * 5 mediante sumas sucesivas.
; Resultado final: 15 en AX y en RAM[F0h].

MOV AX, 0
MOV BX, 5

LOOP:
ADD AX, 3
DEC BX
CMP BX, 0
JNZ LOOP

STORE [F0h], AX
HLT
