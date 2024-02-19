/*
        <h1>CarHUD</h1>
        <button id="sensorOn">Turn On</button>
        <button id="sensorOff">Turn Off</button>
*/

const app = document.createElement("app");
document.body.appendChild(app);

const logo = document.createElement("h1");
logo.textContent = "CarHUD";
logo.classList.add("logo");
app.appendChild(logo);

const socket = io();

function test_latency(){
    const startTime = Date.now();
    socket.emit("ping", function(){
        const duration = Date.now() - startTime;
        console.log(duration + "ms");
        return duration + "ms";
    });
}

// document.getElementById('sensorOn').onclick = function() {
//     socket.emit('toggle', true, (result) => {
//         console.log(result);
//     });
// }

// document.getElementById('sensorOff').onclick = function(){               
//     socket.emit('toggle', false, (result) => {
//         console.log(result);
//     });
// }

// socket.on("data", function(data){
//     console.log(data);
// });

// Warnings
function show_warning(data){
    const element = document.createElement("div");
    element.classList.add("warning");
    element.setAttribute("error", data);
    element.innerHTML = `<span class='m-i'>report</span><p>${data}</p>`;
    app.appendChild(element);
}

function remove_warning(data){ // havent tested this
    const elements = app.querySelectorAll(`div.warning[error="${data}"]`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
}

socket.on("error", function(data){
    show_warning(data);
});

socket.on("resolve", function(data){
    remove_warning(data);
});


// Borders

function show_borders(){
    const element = document.createElement("div");
    element.classList.add("border");
    app.appendChild(element);
}

function hide_borders(){
    const element = app.getElementsByClassName("border");
    for (let i = 0; i < element.length; i++) {
        element[i].remove();
    }
}

// Call

function phone_ringing(){
    
}