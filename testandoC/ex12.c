#include <stdio.h>

int main() {
    int numero, maior;

    for (int i = 0; i < 5; i++) {
        scanf("%d", &numero);
        if (i == 0 || numero > maior) {
            maior = numero;
        }
    }

    printf("%d\n", maior);
    return 0;
}