const int pinoBotao = 2;
const int pinoLed = 8;

void setup() {
  pinMode(pinoBotao, INPUT);
  pinMode(pinoLed, OUTPUT);
}

void loop() {
  if (digitalRead(pinoBotao) == HIGH) {
    digitalWrite(pinoLed, HIGH); // Acende a luz
    delay(5000);                 // Espera 5 segundos (5000 milissegundos)
    digitalWrite(pinoLed, LOW);  // Apaga a luz sozinha
  }
}