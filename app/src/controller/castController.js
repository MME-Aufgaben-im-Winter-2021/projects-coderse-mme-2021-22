import Player from "../view/cast/player.js";
import Recorder from "../view/cast/recorder.js";

class CastController {

  constructor(){
    // Audio Player - Timeline for the Cast
    this.player = new Player();
    // Audio Recorder
    this.recorder = new Recorder();
    this.recorder.addEventListener("send-recording", this.onRecordingSend.bind(this));
  }

  // Function for communication between player and recorder
  onRecordingSend(event) {
    // Just for testing
    let name = "Cast it in",
    time = "69:69";
    this.player.addEntry(name,time);
  }
}

export default CastController;