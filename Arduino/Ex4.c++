const int pinoBotao = 2;
const int pinoBuzzer = 9;

void setup() {
  pinMode(pinoBotao, INPUT);
  pinMode(pinoBuzzer, OUTPUT);
}

void loop() {
  if (digitalRead(pinoBotao) == HIGH) {
    tone(pinoBuzzer, 1000); // Toca o alarme (frequência de 1000Hz)
  } else {
    noTone(pinoBuzzer);     // Fica em silêncio
  }
}