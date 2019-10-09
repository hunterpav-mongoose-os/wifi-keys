load('api_config.js');
load('api_gpio.js');
load('api_timer.js');
load('api_file.js');
load('api_http.js');
load('api_rpc.js');
load('api_log.js');

// count.dat
//{"Right":687,"Left":436}

let led = Cfg.get('board.led1.pin');
GPIO.set_mode(led, GPIO.MODE_OUTPUT);

let do_blink = true;
let init_timer = Timer.set(200, Timer.REPEAT, function() {
  if(do_blink){
	  GPIO.toggle(led);
  }else{
    GPIO.write(led, 1);
  }
}, null);

let pin_left = 4;
let pin_right = 5;

GPIO.set_mode(pin_left, GPIO.MODE_INPUT);
GPIO.set_mode(pin_right, GPIO.MODE_INPUT);

GPIO.set_button_handler(pin_left, GPIO.PULL_UP, GPIO.INT_EDGE_POS, 50, function(x) {
   button('Left');
}, null);

GPIO.set_button_handler(pin_right, GPIO.PULL_UP, GPIO.INT_EDGE_POS, 50, function(x) {
   button('Right');
}, null);

let cur_button = '';
let button = function(btn){
  cur_button = btn;
  HTTP.query({
     url: 'http://192.168.4.1/rpc/'+btn,
     //data: {foo: 1, bar: 'baz'},      // Optional. If set, JSON-encoded and POST-ed
     success: function(body, full_http_msg) {
    		let obj = JSON.parse(File.read('count.dat'));
    		obj[cur_button] = obj[cur_button] + 1;
    		File.write(JSON.stringify(obj), 'count.dat');
    		do_blink = false;
    		blink();
  	 },
     error: function(err) { 
       print(err); 
       do_blink = true;
     },  // Optional
  });
};

let blink = function(){
  GPIO.write(led, 0);
  Timer.set(200, 0, function() {
    GPIO.write(led, 1);
  }, null);
};

let log = [];
RPC.addHandler('stats', function(args) {
	let obj = JSON.parse(File.read('count.dat'));
	obj.log = log;
	return obj;
});


Event.addHandler(Event.LOG, function(ev, evdata, ud) {
  log.push( Event.evdataLogStr(evdata) );
  if(log.length > 15){
    log.splice(0,2);
  }
}, null);
