load('api_i2c.js');
load('api_gpio.js');
load('api_rpc.js');
load('api_timer.js');

// Blink built-in LED every second
GPIO.set_mode(2, GPIO.MODE_OUTPUT);
GPIO.blink(2,1000,50);

let i2c = I2C.get();

RPC.addHandler('Left', function(args) {
  I2C.write(i2c, 5, chr(80), 1, true);
  return {"success": true};
});

RPC.addHandler('Right', function(args) {
  I2C.write(i2c, 5, chr(79), 1, true);
  return {"success": true};
});
