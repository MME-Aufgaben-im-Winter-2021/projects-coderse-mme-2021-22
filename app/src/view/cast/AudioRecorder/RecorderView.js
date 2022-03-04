/* eslint-env browser */

import {Observable, Event} from "../../../utils/Observable.js";

var iconLight, 
    title, 
    time, 
    iconStart, 
    iconSend,
    startTime,
    timerInterval,
    audioLength;

class Recorder extends Observable {

    constructor() {
        super();
        this.initUI();
    }

    initUI(){
        iconLight = document.querySelector(".recorder-icon-light");
        title = document.querySelector(".recorder-title");
        time = document.querySelector(".recorder-time");
        iconStart = document.querySelector(".recorder-icon-start");
        iconSend = document.querySelector(".recorder-icon-send");
        iconStart.addEventListener("click",this.onStartRecording.bind(this));
        iconSend.addEventListener("click", this.onSendRecording.bind(this));
    }
  
    onStartRecording(){
        console.log("Recording starts");
        startTimer();
        toggleIconLight();
        let event = new Event("start-recording", "data");
        this.notifyAll(event);
    }
  
    onSendRecording(){
        console.log("Recording stops");
        stopTimer();
        toggleIconLight();
        let data = {
            title: title.value,
            time: audioLength,
        },
            event = new Event("send-recording", data);
        this.notifyAll(event);
        title.value = "";
    }
  
}

//Starts the timer, stores the start time and shows the current length of the recording audio file
function startTimer(){
    startTime = Date.now();
    timerInterval = setInterval(()=>{
        let currentTime = Date.now(),
            formatter = new Intl.NumberFormat('de-DE', { minimumIntegerDigits: 2 }),
            minutes,
            seconds;
        audioLength = Math.floor((currentTime - startTime) /1000);
        minutes = formatter.format(Math.floor(audioLength/60));
        seconds = formatter.format(audioLength % 60);
        audioLength = minutes + ":" + seconds;
        time.innerHTML = audioLength;
    },1000);
}

//Stops the timer and showing the time in the UI
function stopTimer(){
    clearInterval(timerInterval);
    time.innerHTML = "00:00";
}
//Turns the Lightbulb on/off
function toggleIconLight(){
    if(iconLight.style.background !== "lemonchiffon"){
        iconLight.style.borderRadius = "999px";
        iconLight.style.background = "lemonchiffon";
    } else {iconLight.style.background = " ";}
}

export default Recorder;
