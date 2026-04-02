const int pinoLDR = A0;
const int pinoTemp = A1;
const int pinoLed = 8;
const int pinoBuzzer = 9;

void setup() {
  pinMode(pinoLed, OUTPUT);
  pinMode(pinoBuzzer, OUTPUT);
}

void loop() {
  int nivelLuz = analogRead(pinoLDR);
  int leituraTemp = analogRead(pinoTemp);
  
  float temperatura = (leituraTemp * 5.0 * 100.0) / 1024.0; 

  // Decisão 1 (Visual): Está escuro?
  if (nivelLuz < 300) {
    digitalWrite(pinoLed, HIGH);
  } else {
    digitalWrite(pinoLed, LOW);
  }

  // Decisão 2 (Sonora): Está pegando fogo?
  if (temperatura > 30.0) {
    tone(pinoBuzzer, 1000);
  } else {
    noTone(pinoBuzzer);
  }

  delay(500); // Estabilidade do sistema
}