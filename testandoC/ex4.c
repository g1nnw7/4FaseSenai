#include <stdio.h>

int main() {
    int numero;
    scanf("%d", &numero);
    
    if (numero >= 0) {
        printf("Positivo\n");
    } else {
        printf("Negativo\n");
    }
    return 0;
}