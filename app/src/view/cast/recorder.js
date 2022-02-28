/* eslint-env browser */

 var iconLight, 
    title, 
    time, 
    iconStart, 
    iconSend;

class Recorder {

  constructor() {
      this.initUI();
  }

  initUI(){
    iconLight = document.querySelector(".recorder-icon-light");
    title = document.querySelector(".recorder-title");
    time = document.querySelector(".recorder-time");
    iconStart = document.querySelector(".recorder-icon-start");
    iconSend = document.querySelector(".recorder-icon-share");
    iconStart.addEventListener("click",this.onStartRecording());
    iconSend.addEventListener("click", this.onSendRecording());
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
  }
  
}
function toggleTimer(){}
function toggleIconLight(){}
function setTitle(){
    title.innerHTML = "Code-Cast One";
}
export default Recorder;
