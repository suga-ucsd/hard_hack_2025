#include <Servo.h>

Servo myServo;  
const int espPin = 2;  // Button connected to pin 2
bool wasPressed=false; 
// void buttonISR() {
//     espPressed = true;
// }

void setup() {
    Serial.begin(9600);
    myServo.attach(9);       // Servo on pin 9
    pinMode(espPin, INPUT);  // Set button pin as input with internal pull-up resistor
    myServo.write(93);
    // attachInterrupt(digitalPinToInterrupt(espPin), buttonISR, CHANGE);  // Trigger on button press
}

void loop() {
  // Serial.println(digitalRead(espPin));
    if (wasPressed && !digitalRead(espPin)) {
      Serial.println("motor opening");
      wasPressed=false;
       myServo.write(90);  // Move servo to 90°
          delay(1000);  // Wait 5 seconds
          myServo.write(93);  // Reset servo position (optional)
    }
    else if (!wasPressed && digitalRead(espPin)){
      Serial.println("motor closing");
      myServo.write(96);  // Move servo to 90°
        delay(1000);  // Wait 5 seconds
        myServo.write(93);  // Reset servo position (optional
      wasPressed=true;
          
    }
}