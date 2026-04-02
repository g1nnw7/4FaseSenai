const int pinoPotenciometro = A0;
const int pinoLed = 9; // Deve ser um pino PWM (~9)

void setup() {
  pinMode(pinoLed, OUTPUT);
}

void loop() {
  int valorPot = analogRead(pinoPotenciometro); // Lê de 0 a 1023
  
  // O LED recebe valores de 0 a 255. O comando map converte isso.
  int brilho = map(valorPot, 0, 1023, 0, 255); 
  
  analogWrite(pinoLed, brilho); // Define a força da luz
}