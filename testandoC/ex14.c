#include <stdio.h>

int main() {
    int valor;

    while (1) {
        scanf("%d", &valor);

        if (valor == 0) {
            break;
        }

        if (valor > 30) {
            printf("ALERTA: ALTO\n");
        } else if (valor < 10) {
            printf("ALERTA: BAIXO\n");
        } else {
            printf("NORMAL\n");
        }
    }
    return 0;
}