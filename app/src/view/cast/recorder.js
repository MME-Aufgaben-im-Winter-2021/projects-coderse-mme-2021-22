/* eslint-env browser */

import {Observable, Event} from "../../utils/Observable.js";

 var iconLight, 
    title, 
    time, 
    iconStart, 
    iconSend;

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
    toggleTimer();
    toggleIconLight();
    setTitle();
  }
  onSendRecording(){
      console.log("Recording stops");
      toggleTimer();
      toggleIconLight();
      let event = new Event("send-recording", "data");
      this.notifyAll(event);
  }
  
}
function toggleTimer(){}
function toggleIconLight(){}
function setTitle(){
    title.innerHTML = "Code-Cast One";
}
export default Recorder;
