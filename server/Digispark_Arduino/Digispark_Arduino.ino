/* ATtiny85 as an I2C Slave            BroHogan                           1/12/11
 * Example of ATtiny I2C slave receiving and sending data to an Arduino master.
 * Gets data from master, adds 10 to it and sends it back.
 * SETUP:
 * ATtiny Pin 1 = (RESET) N/U                      ATtiny Pin 2 = (D3) N/U
 * ATtiny Pin 3 = (D4) to LED1                     ATtiny Pin 4 = GND
 * ATtiny Pin 5 = I2C SDA on DS1621  & GPIO        ATtiny Pin 6 = (D1) to LED2
 * ATtiny Pin 7 = I2C SCK on DS1621  & GPIO        ATtiny Pin 8 = VCC (2.7-5.5V)
 * NOTE! - It's very important to use pullups on the SDA & SCL lines!
 * Current Rx & Tx buffers set at 32 bytes - see usiTwiSlave.h
 * Credit and thanks to Don Blake for his usiTwiSlave code. 
 * More on TinyWireS usage - see TinyWireS.h
 */


#include "TinyWireS.h"                  // wrapper class for I2C slave routines
#define I2C_SLAVE_ADDR  0x5            // i2c slave address (38)


#include "DigiKeyboard.h"
#define KEY_UP_ARROW 0x52
#define KEY_DOWN_ARROW 0x51
#define KEY_LEFT_ARROW 0x50
#define KEY_RIGHT_ARROW 0x4F

void setup(){
  TinyWireS.begin(I2C_SLAVE_ADDR);      // init I2C Slave mode
  pinMode(1, OUTPUT);
}


void loop(){
  
  byte byteRcvd = 0;
  if (TinyWireS.available()){           // got I2C input!
    byteRcvd = TinyWireS.receive();     // get the byte from master
//    String myString = String(byteRcvd, HEX);
//    DigiKeyboard.println(myString);
    if (byteRcvd == KEY_LEFT_ARROW) {
      DigiKeyboard.sendKeyStroke(KEY_LEFT_ARROW );
      blink();
    }
    if (byteRcvd == KEY_RIGHT_ARROW) {
      DigiKeyboard.sendKeyStroke(KEY_RIGHT_ARROW );
      blink();
    }

  }

  DigiKeyboard.delay(10);

}

void blink(){
     //Set the LED pins to HIGH. This gives power to the LED and turns it on
    digitalWrite(1, HIGH);
    //Wait for a second
    DigiKeyboard.delay(50);
    //Set the LED pins to LOW. This turns it off  
    digitalWrite(1, LOW);  
}



