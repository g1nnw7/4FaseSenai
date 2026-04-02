const int pinoBotao = 2;
const int pinoLed = 8;
int estadoLed = LOW;
int estadoAnterior = LOW;

void setup() {
  pinMode(pinoBotao, INPUT);
  pinMode(pinoLed, OUTPUT);
}

void loop() {
  int leituraBotao = digitalRead(pinoBotao);

  if (leituraBotao == HIGH && estadoAnterior == LOW) {
    estadoLed = !estadoLed; // Inverte o estado
    digitalWrite(pinoLed, estadoLed);
    delay(200); // Pausa para não ler o clique duas vezes
  }
  estadoAnterior = leituraBotao;
}