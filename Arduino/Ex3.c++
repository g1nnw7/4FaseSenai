const int pinoLDR = A0;
const int pinoLed = 8;

void setup() {
  pinMode(pinoLed, OUTPUT);
}

void loop() {
  int luz = analogRead(pinoLDR);

  if (luz < 300) { // Menor que 300 = Escuro
    digitalWrite(pinoLed, HIGH);
  } else {
    digitalWrite(pinoLed, LOW);
  }
  delay(100);
}