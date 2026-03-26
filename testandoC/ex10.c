#include <stdio.h>

int main() {
    int limite, soma = 0;
    scanf("%d", &limite);
    
    for (int i = 1; i <= limite; i++) {
        soma = soma + i;
    }
    
    printf("resultado = %d\n", soma);
    return 0;
}