/*
   --------------------------------------------------------------------------------------------------------------------
   Example sketch/program showing how to read data from a PICC to serial.
   --------------------------------------------------------------------------------------------------------------------
   This is a MFRC522 library example; for further details and other examples see: https://github.com/miguelbalboa/rfid

   Example sketch/program showing how to read data from a PICC (that is: a RFID Tag or Card) using a MFRC522 based RFID
   Reader on the Arduino SPI interface.

   When the Arduino and the MFRC522 module are connected (see the pin layout below), load this sketch into Arduino IDE
   then verify/compile and upload it. To see the output: use Tools, Serial Monitor of the IDE (hit Ctrl+Shft+M). When
   you present a PICC (that is: a RFID Tag or Card) at reading distance of the MFRC522 Reader/PCD, the serial output
   will show the ID/UID, type and any data blocks it can read. Note: you may see "Timeout in communication" messages
   when removing the PICC from reading distance too early.

   If your reader supports it, this sketch/program will read all the PICCs presented (that is: multiple tag reading).
   So if you stack two or more PICCs on top of each other and present them to the reader, it will first output all
   details of the first and then the next PICC. Note that this may take some time as all data blocks are dumped, so
   keep the PICCs at reading distance until complete.

   @license Released into the public domain.

   Typical pin layout used:
   -----------------------------------------------------------------------------------------
               MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
               Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
   Signal      Pin          Pin           Pin       Pin        Pin              Pin
   -----------------------------------------------------------------------------------------
   RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
   SPI SS      SDA(SS)      10            53        D10        10               10
   SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
   SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
   SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15

   More pin layouts for other boards can be found here: https://github.com/miguelbalboa/rfid#pin-layout
*/

#include <SPI.h>
#include <MFRC522.h>
#include <MFRC522Extended.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
// #include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <Servo.h>
#include <WiFiClient.h>


const char* serverName = "http://172.20.10.14:65432";


Servo myServo;  
// Replace these with your Wi‑Fi network credentials
const char* ssid = "Aviral";
const char* password = "12345678";
//const char* server = "http://172.20.10.13:8082";  // Replace with your server's IP and port
unsigned long uid = 0;
bool cardPresent = false;
bool lockState = 0; //0 is lock open
#define RST_PIN 2  // Configurable, see typical pin layout above
#define SS_PIN 15  // Configurable, see typical pin layout above
int Servopin = 16;
ESP8266WebServer server(8082);
int pinState=0;

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

/**
   mfrc522.PICC_IsNewCardPresent() should be checked before
   @return the card UID or 0 when an error occurred
*/



Adafruit_MPU6050 mpu;
//volatile bool motionDetected = false;

//void IRAM_ATTR motionISR() {
//  motionDetected = true;
//}

//void handleMotion(){
////  digitalWrite(4, HIGH);  // Turn on LED
//  Serial.println("Motion Detected!");
////  delay(100);              // Brief delay for demonstration
////  digitalWrite(4, LOW);
//}



//unsigned long getID(TagInfo *tag) {
//
//  for (byte i = 0; i < tag->uid.size; i++) {
//    if (tag->uid.uidByte[i] < 0x10)
//      Serial.print(F(" 0"));
//    else
//      Serial.print(F(" "));
//    Serial.print(tag->uid.uidByte[i], HEX);
//  }
//}

//void connectToWiFi() {
//  sendCommand("AT", 2000);
//  sendCommand("AT+CWMODE=1", 2000);
//  sendCommand("AT+CWJAP=\"Your_SSID\",\"Your_PASSWORD\"", 5000);
//}

void handleRoot() {
  // Convert pinState to a String so we can send it as a response
  String response = String(pinState);
  pinState=0;
  server.send(200, "text/plain", response);
}

void setup() {

  // Initialize serial for debugging
  Serial.begin(115200);
  delay(10);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  // Initiate connection to Wi‑Fi network
  WiFi.begin(ssid, password);

  // Wait until connected
   while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
   }

   Serial.println("");
   Serial.println("WiFi connected!");
   Serial.print("IP address: ");
   Serial.println(WiFi.localIP());
  server.on("/", HTTP_GET, handleRoot);
  server.begin();
  Serial.println("HTTP server started");
   

  while (!Serial) delay(10);  // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin();                        // Init SPI bus
  mfrc522.PCD_Init();                 // Init MFRC522
  delay(4);                           // Optional delay. Some board do need more time after init to be ready, see Readme
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  // Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
  //  pinMode(4,OUTPUT);
  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }

  }

  //setupt motion detection
  mpu.setHighPassFilter(MPU6050_HIGHPASS_0_63_HZ);
  mpu.setMotionDetectionThreshold(1);
  mpu.setMotionDetectionDuration(20);
  mpu.setInterruptPinLatch(true);  // Keep it latched.  Will turn off when reinitialized.
  mpu.setInterruptPinPolarity(true);
  mpu.setMotionInterrupt(true);
  pinMode(0, OUTPUT);
  digitalWrite(0, LOW);
  //  Serial.println("");
  delay(100);
  //  pinMode(0, INPUT); // Ensure pin 2 is set as input
  //  attachInterrupt(digitalPinToInterrupt(0), motionISR, FALLING);
  // pinMode(4,INPUT);


  myServo.attach(Servopin);
  myServo.write(90);
}

void loop() {
  // if (WiFi.status() == WL_CONNECTED) {
     WiFiClient client;
    //  HTTPClient http;
     server.handleClient();

  //   // Your Domain name with URL path or IP address with path
    //  http.begin(client, server);
  //   http.begin(server);
  //   http.addHeader("Content-Type", "application/json");
  //   String httpRequestData = "test";

  //   int httpResponseCode = http.POST(httpRequestData);

  //   Serial.print("HTTP Response code: ");
  //   Serial.println(httpResponseCode);
  //   http.end();
  // }
  // Send data to Firebase
  if (!mfrc522.PICC_IsNewCardPresent()) {cardPresent = false;}
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (mfrc522.PICC_IsNewCardPresent() && !cardPresent) {
    cardPresent = true;
    // Serial.println("NEW CARD FOUND");
    // return;
    // Select one of the cards
    if (!mfrc522.PICC_ReadCardSerial()) {
      return;
    }
    unsigned int temp = mfrc522.Custom_get_ID(&(mfrc522.uid));
    /*This is a custom function to get the ID of the card. Put this in the NFRC522.cpp library file
      Remember to add declaration in NFRC522.h file
      
        unsigned long MFRC522::Custom_get_ID(Uid *uid	///< Pointer to Uid struct returned from a successful PICC_Select().
                        ) {
        // UID
        // Serial.print(F("Card UID:"));
        unsigned long answer = 0;
        for (byte i = 0; i < uid->size; i++) {
          answer += (uid->uidByte[i]) << (((uid->size) - 1 - i)*8);

        } 
        PICC_HaltA();
        return answer;
      } // End PICC_DumpDetailsToSerial()
    */

    Serial.println(temp);
    // mfrc522.PICC_DumpToSerial(&(mfrc522.uid));
    if (!lockState) {
      //tell arduino to close lock

      digitalWrite(0, HIGH);
//      myServo.write(90);

      uid = temp;
      lockState = true;
      Serial.println("Lock closing");
    }
    else if (lockState && uid == temp) {
      //tell to open lock
      digitalWrite(0, LOW);
   
      uid = 0;
      lockState = false;
      Serial.println("Lock opening");
    }

    // Dump debug info about the card; PICC_HaltA() is automatically called

    // if (mfrc522.PICC_IsNewCardPresent()) {

    // }
  }

  //
  //  if(motionDetected){
  //    motionDetected=false;
  //    handleMotion();
  //  }
  //  delay(10);

  if (mpu.getMotionInterruptStatus()) {
    Serial.println("Motion detected");
    pinState=1;
    // int httpResponseCode = http.POST("1");
    // delay(1100);
    // int httpResponseCode = http.POST("0");
  }
}
