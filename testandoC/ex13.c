#include <stdio.h>

int main() {
    int numero, positivos = 0, negativos = 0;

    for (int i = 0; i < 5; i++) {
        scanf("%d", &numero);
        if (numero >= 0) {
            positivos++;
        } else {
            negativos++;
        }
    }

    printf("Positivos: %d\n", positivos);
    printf("Negativos: %d\n", negativos);
    return 0;
}