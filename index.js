const arduino_port = 'COM3';
const http_port = 3000;

// Server
const http = require('http');
const fs = require('fs');
const index = fs.readFileSync('client/index.html');

const app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

const { Server } = require("socket.io");
const io = new Server(app);

app.listen(http_port);

// Serial port
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { type } = require('os');

const port = new SerialPort({
    path: arduino_port,
    delimeter: '\n',
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

const parser = port.pipe(new ReadlineParser({
    delimiter: '\r\n'
}));


// User interface
io.on('connection', function(socket){
    socket.on('toggle', function(data, callback){
        if(typeof data == "boolean"){
            if(data == true){
                port.write("trueee");
            }
            else{
                port.write("false ;(");
            }
        }
        else{
            if(typeof callback == "function"){
                callback("Request isn't boolean");
            }
        }
    });
});

parser.on('data', function(arduinoData){
    io.emit("data", arduinoData);
});

