const int pinoSensor = A0;

void setup() {
  Serial.begin(9600); // Abre o canal de comunicação com o PC
}

void loop() {
  int valor = analogRead(pinoSensor);
  
  Serial.print("Valor lido no ambiente: ");
  Serial.println(valor);
  
  delay(300); // Atualiza 3 vezes por segundo
}