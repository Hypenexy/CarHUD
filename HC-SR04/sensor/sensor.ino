const int sensor1_trigPin = 9;
const int sensor1_echoPin = 10;
// const int sensor2_trigPin = 5;
// const int sensor2_echoPin = 6;

float duration1, distance1, duration2, distance2;

int expected_ceiling_distance = 0;

bool debug = false;
bool device_active = true;

void setup() {
  pinMode(sensor1_trigPin, OUTPUT);
  pinMode(sensor1_echoPin, INPUT);
  // pinMode(sensor2_trigPin, OUTPUT);
  // pinMode(sensor2_echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  if(Serial.available() > 0){
    
    String receivedString = "";
    
    while (Serial.available() > 0) {
      receivedString += char(Serial.read ());
    }
    
    // Serial.println(receivedString);
    
    if(receivedString == "1"){
      device_active = false;
    }

    if(receivedString == "ping"){
      Serial.println("pong");
    }
  }

  if(device_active == true){
    digitalWrite(sensor1_trigPin, LOW);
    // digitalWrite(sensor2_trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(sensor1_trigPin, HIGH);
    // digitalWrite(sensor2_trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(sensor1_trigPin, LOW);
    // digitalWrite(sensor2_trigPin, LOW);

    duration1 = pulseIn(sensor1_echoPin, HIGH);
    distance1 = (duration1*.0343)/2;
    if(debug){
      Serial.print("Distance 1: ");
      Serial.print(distance1);
      Serial.println("cm");
    }

    if(expected_ceiling_distance < 5){
      expected_ceiling_distance++;
      if(expected_ceiling_distance == 4){
        if(distance1 < 15 && distance1 > 0){
          Serial.println("Error: Ceiling too low!");
        }
        if(distance1 == 0){
          Serial.println("Error: Sensor not working!");
        }
        expected_ceiling_distance = distance1;
      }
    }

    if(distance1 > 0 && expected_ceiling_distance == 0){
      Serial.println("Resolved: Sensor not working!");
    }

    // if(expected_ceiling_distance)

    // For the second sensor remove pulseIn!

    // duration2 = pulseIn(sensor2_echoPin, HIGH);
    // distance2 = (duration2*.0343)/2;
    // Serial.print("Distance 2: ");
    // Serial.print(distance2);
    // Serial.println("cm");
  }


  delay(100);
}