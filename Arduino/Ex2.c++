const int pinoTemp = A1;
const int pinoLed = 8;

void setup() {
  pinMode(pinoLed, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int valor = analogRead(pinoTemp);
  // Conversão simples para graus Celsius usando o LM35
  float temperatura = (valor * 5.0 * 100.0) / 1024.0;
  
  Serial.println(temperatura);

  if (temperatura > 30.0) {
    digitalWrite(pinoLed, HIGH);
  } else {
    digitalWrite(pinoLed, LOW);
  }
  delay(500);
}