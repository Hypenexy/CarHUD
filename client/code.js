const app = document.createElement("app");
document.body.appendChild(app);

const mirror = document.createElement("div");
mirror.classList.add("mirror");
app.appendChild(mirror);

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
}

phone_ringing(359898777294);