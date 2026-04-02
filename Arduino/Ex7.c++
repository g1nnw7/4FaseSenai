const int botao1 = 2;
const int botao2 = 3;
const int ledAcesso = 8;
int passo = 0; // Controla onde estamos na senha

void setup() {
  pinMode(botao1, INPUT);
  pinMode(botao2, INPUT);
  pinMode(ledAcesso, OUTPUT);
}

void loop() {
  // Passo 0: Esperando o botão 1
  if (passo == 0 && digitalRead(botao1) == HIGH) {
    passo = 1;
    delay(300); // Debounce
  }
  
  // Passo 1: Esperando o botão 2
  if (passo == 1 && digitalRead(botao2) == HIGH) {
    passo = 2; 
    delay(300);
  }

  // Se apertar o botão 2 primeiro, zera tudo (errou a senha)
  if (passo == 0 && digitalRead(botao2) == HIGH) {
    passo = 0;
  }

  // Se chegou no passo 2, acerta a senha e liga a luz
  if (passo == 2) {
    digitalWrite(ledAcesso, HIGH);
  }
}