const int trigPin = 3;
const int echoPin = 4;
const int pinoBuzzer = 9;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pinoBuzzer, OUTPUT);
}

void loop() {
  // Mandando o sinal de som
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Lendo o tempo que o som demorou para voltar
  long duracao = pulseIn(echoPin, HIGH);
  int distancia = duracao * 0.034 / 2; // Fórmula para converter em centímetros

  if (distancia < 10) {
    tone(pinoBuzzer, 1000);
    delay(100); // Apito muito rápido (urgência)
    noTone(pinoBuzzer);
    delay(100);
  } else if (distancia < 30) {
    tone(pinoBuzzer, 1000);
    delay(100);
    noTone(pinoBuzzer);
    delay(500); // Apito mais lento
  }
}