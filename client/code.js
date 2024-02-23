const app = document.createElement("app");
document.body.appendChild(app);

// app.classList.add("mirror"); For carring

function createElement(name, parent){
    const element = document.createElement("div");
    element.classList.add(name);
    parent.appendChild(element);
    return element;
}

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

// Turn sensor off on browser connection

socket.emit("toggle", false);

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

function remove_warning(data){
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
    createElement("border", app);
}

function hide_borders(){
    const element = app.getElementsByClassName("border");
    for (let i = 0; i < element.length; i++) {
        element[i].remove();
    }
}

// Call

var contacts = {
    359898777294: {
        name: "Georgi Murlev",
        picture: ""
    },
};

function phone_ringing(number){
    const contact = {};
    const contactId = number.toString();
    if(Object.keys(contacts).includes(contactId)){
        contact.name = contacts[contactId].name;
    }
    else{
        contact.name = number;
    }

    const call = createElement("call", app);
    const headerText = createElement("headerText", call);
    headerText.textContent = "Incoming call";

    const info = createElement("info", call);

    const picture = createElement("picture", info);
    picture.classList.add("m-i");
    if(!contact.picture){
        picture.classList.add("icon");
    }
    picture.textContent = "person";
    const name = createElement("name", info);
    name.textContent = contact.name;
    
    const actions = createElement("actions", call)
    
    const btn_1 = createElement("btn", actions);
    const decline_btn = createElement("m-i", btn_1);
    decline_btn.textContent = "front_hand";
    const decline_text = createElement("text", btn_1);
    decline_text.textContent = "Decline";

    const btn_2 = createElement("btn", actions);
    const accept_btn = createElement("m-i", btn_2);
    accept_btn.textContent = "front_hand";
    const accept_text = createElement("text", btn_2);
    accept_text.textContent = "Accept";

    socket.emit("toggle", true);
    left_function = () => { // Decline
        headerText.textContent = "Declined call";
        call.classList.add("declined");
        setTimeout(() => {
            call.remove();
        }, 500);
    }

    right_function = () => { // Accept
        headerText.textContent = "Ongoing call";
        btn_2.classList.add("accepted");
        call.classList.add("accepted");
        decline_text.textContent = "End";
        setTimeout(() => {
            socket.emit("toggle", true);
            left_function = right_function = () => { // Hang up
                headerText.textContent = "Call ended";
                setTimeout(() => {
                    call.classList.add("hangup");
                    setTimeout(() => {
                        call.remove();
                    }, 500);
                }, 500);
            }
        }, 1000);
    }
}

phone_ringing(359898777294);

// Sensor Actions

function visual(direction){
    const visual = createElement(direction, app);
    setTimeout(() => {
        visual.classList.add("hide");
        setTimeout(() => {
            visual.remove();
        }, 500);
    }, 1000);
}

var left_function,
    right_function;

function left(){
    visual("left");
    if(typeof left_function == "function"){
        left_function();
        left_function = "";
    }
}

function right(){
    visual("right");
    if(typeof right_function == "function"){
        right_function();
        right_function = "";
    }
}

socket.on("data", function(data){
    if(data.startsWith("Action:")){
        if(data.endsWith("Left")){
            left();
        }
        if(data.endsWith("Right")){
            right();
        }
        setTimeout(() => {
            socket.emit("toggle", false);
        }, 500);
    }
});