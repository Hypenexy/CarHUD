const arduino_port = 'COM3';
const http_port = 3000;

// Server
const http = require('http');
const fs = require('fs');
const index = fs.readFileSync('client/index.html');
const code = fs.readFileSync('client/code.js');
const style = fs.readFileSync('client/style.css');
const font = fs.readFileSync('client/font/Outfit-VariableFont_wght.ttf');
const icons = fs.readFileSync('client/font/Material-Icons-Outlined.woff2');

const app = http.createServer(function(req, res){
    if(req.url == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(index);
    }
    if(req.url == "/code.js"){
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(code);
    }
    if(req.url == "/style.css"){
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(style);
    }
    if(req.url == "/Outfit-VariableFont_wght.ttf"){
        res.writeHead(200, {'Content-Type': 'font/ttf'}); // or woff2
        res.end(font);
    }
    if(req.url == "/Material-Icons-Outlined.woff2"){
        res.writeHead(200, {'Content-Type': 'font/woff2'});
        res.end(icons);
    }
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
    // delimeter: '\n',
    baudRate: 9600,
    // dataBits: 8,
    // parity: 'none',
    // stopBits: 1,
    // flowControl: false
});

const parser = port.pipe(new ReadlineParser({
    delimiter: '\r\n'
}));


// User interface
io.on('connection', function(socket){
    for (let i = 0; i < active_errors.length; i++) {
        const element = active_errors[i];
        io.emit("error", element);
    }
    socket.on('ping', function(callback){
        if(typeof callback == "function"){
            port.write("ping", function(){
                parser.on("data", (data) =>{
                    callback(data);
                });
            });
        }
    })
    socket.on('toggle', function(data, callback){
        if(typeof data == "boolean"){
            if(data == true){
                port.write("toggleOn");
            }
            else{
                port.write("toggleOff");
            }
        }
        else{
            if(typeof callback == "function"){
                callback("Request isn't boolean");
            }
        }
    });
});

const active_errors = [];

parser.on('data', function(arduinoData){
    if(arduinoData.startsWith("Error:")){
        var error = arduinoData.slice(7, arduinoData.length);
        if(!active_errors.includes(error)){
            active_errors.push(error);
            io.emit("error", error);
        }
    }
    if(arduinoData.startsWith("Resolved:")){
        var error = arduinoData.slice(10, arduinoData.length);
        const index = active_errors.indexOf(error);
        if(index > -1){
            active_errors.splice(index, 1);
            io.emit("resolved", error);
        }
    }
    io.emit("data", arduinoData);
});


// Bluetooth
