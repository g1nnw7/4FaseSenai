#include <stdio.h>

int main() {
    int soma = 0;
    
    for (int i = 1; i <= 5; i++) {
        soma = soma + i;
    }
    
    printf("%d\n", soma);
    return 0;
}