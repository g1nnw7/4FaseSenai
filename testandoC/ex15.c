#include <stdio.h>

int main() {
    int opcao;

    do {
        printf("1 - Ligar sistema\n");
        printf("2 - Desligar sistema\n");
        printf("3 - Sair\n");
        scanf("%d", &opcao);

        if (opcao == 1) {
            printf("Sistema ligado!\n");
        } else if (opcao == 2) {
            printf("Sistema desligado!\n");
        }
        
    } while (opcao != 3);

    return 0;
}