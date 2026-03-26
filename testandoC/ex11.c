#include <stdio.h>

int main() {
    float n1, n2, n3, media;
    scanf("%f %f %f", &n1, &n2, &n3);
    
    media = (n1 + n2 + n3) / 3.0;
    printf("%.2f\n", media);
    
    if (media >= 7.0) {
        printf("Aprovado\n");
    } else {
        printf("Reprovado\n");
    }
    return 0;
}