const int sensor1_trigPin = 9;
const int sensor1_echoPin = 10;
const int sensor2_trigPin = 5;
const int sensor2_echoPin = 6;

float duration1, distance1, duration2, distance2;

void setup() {
  pinMode(sensor1_trigPin, OUTPUT);
  pinMode(sensor1_echoPin, INPUT);
  pinMode(sensor2_trigPin, OUTPUT);
  pinMode(sensor2_echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(sensor1_trigPin, LOW);
  digitalWrite(sensor2_trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(sensor1_trigPin, HIGH);
  digitalWrite(sensor2_trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(sensor1_trigPin, LOW);
  digitalWrite(sensor2_trigPin, LOW);

  duration2 = pulseIn(sensor2_echoPin, HIGH);
  duration1 = pulseIn(sensor1_echoPin, HIGH);
  distance1 = (duration1*.0343)/2;
  Serial.print("Distance 1: ");
  Serial.print(distance1);
  Serial.println("cm");

  distance2 = (duration2*.0343)/2;
  Serial.print("Distance 2: ");
  Serial.print(distance2);
  Serial.println("cm");

  delay(100);
}