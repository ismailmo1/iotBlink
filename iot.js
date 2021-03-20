const client=mqtt.connect("ws://broker.hivemq.com:8000/mqtt");
const btnToggle=document.querySelector('#ledToggle');
const currStatus=document.querySelector('#ledStatus');
const lastReceived=document.querySelector('#lastReceived');
client.subscribe("ismail/espOut/led1");
var ledBool

function formatDate(date) {
    // from https://stackoverflow.com/a/25275808
    var hours=date.getHours();
    var minutes=date.getMinutes();
    var seconds=date.getSeconds();
    var ampm=hours>=12? 'pm':'am';
    hours=hours%12;
    hours=hours? hours:12; // the hour '0' should be '12'
    minutes=minutes<10? '0'+minutes:minutes;
    seconds=seconds<10? '0'+seconds:seconds;
    var strTime=hours+':'+minutes+':'+seconds+ampm;
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"  "+strTime;
}

function sendLedSignal(signal) {
    console.log(`sending ${signal}`);
    client.publish("ismail/espIn", signal);
}

function sendLedOn() {
    sendLedSignal("1");
}

function sendLedOff() {
    sendLedSignal("0");
}

function ledON() {
    if (ledBool) {
        currStatus.textContent="LED STATUS: ON";
        // btnToggle.classList.add("btn-warning");
        // btnToggle.classList.remove("btn-secondary");
        btnToggle.removeEventListener("click", sendLedOn);
        btnToggle.addEventListener("click", sendLedOff);
    };


};

function ledOFF() {
    if (!ledBool) {
        currStatus.textContent="LED STATUS: OFF";
        // btnToggle.classList.add("btn-secondary");
        // btnToggle.classList.remove("btn-warning");
        btnToggle.removeEventListener("click", sendLedOff);
        btnToggle.addEventListener("click", sendLedOn);
    };

};
btnToggle.addEventListener("click", () => {
    btnToggle.classList.toggle("btn-warning")
    btnToggle.classList.toggle("btn-secondary")

})

client.on("message", function (topic, payload) {

    if (payload.toString()==="ON") {
        ledBool=true;
        ledON();
    } else if (payload.toString()==="OFF") {
        ledBool=false;
        ledOFF();
    };
    lastReceived.textContent=`last communication: ${formatDate(new Date())}`;



})




