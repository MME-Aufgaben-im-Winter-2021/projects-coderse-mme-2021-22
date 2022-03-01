import PlayerView from "../view/cast/AudioPlayer/PlayerView.js";
import RecorderView from "../view/cast/AudioRecorder/RecorderView.js";

class CastController {

  constructor(){
    // Audio Player - Timeline for the Cast
    this.player = new PlayerView();
    // Audio Recorder
    this.recorder = new RecorderView();
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