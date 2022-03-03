/* eslint-env browser */

import PlayerView from "../view/cast/AudioPlayer/PlayerView.js";
import RecorderView from "../view/cast/AudioRecorder/RecorderView.js";
import NavView from "../view/cast/Navbar/NavView.js";
import CodeView from "../view/cast/CodeField/CodeView.js";
import CastManager from "../model/castManager.js";
import FileTypeValidator from "../model/FileTypeValidator.js";

var castManager,
    fileTypeValidator;

// Controller to link data and views on the Cast Creation page
// Connects Views and Models with events -> Communication

class CastController {

    constructor(){
        // General model for a cast. Combines multiple models
        castManager = new CastManager();
        castManager.addEventListener("audio-recorded", this.onAudioRecorded.bind(this));
        
        // Model for validating dropped files
        fileTypeValidator = new FileTypeValidator();
        
        // Audio Player - Timeline for the Cast
        this.player = new PlayerView();
        this.player.addEventListener("entry-delete", this.onEntryDelete.bind(this));
        this.player.addEventListener("entry-play", this.onEntryPlay.bind(this));
        // Audio Recorder
        this.recorder = new RecorderView();
        this.recorder.addEventListener("send-recording", this.onRecordingSend.bind(this));
        this.recorder.addEventListener("start-recording", this.onRecordingStart.bind(this));
        // Code View
        this.codeView = new CodeView();
        this.codeView.addEventListener("file-dropped", this.onFileDropped.bind(this));
        // Navbar View
        this.navView = new NavView();
        this.navView.addEventListener("cast-safe", this.safeCast.bind(this));
    }

    // Function for communication between player and recorder
    onRecordingSend(event) {
        castManager.stopRecord(event);
    }

    // Function for communication between player and recorder
    onRecordingStart(event) {
      castManager.startRecord();
    }

    // Validator checks dropped file
    // File is stored in Cast Manager model
    // File is handed to View 
    onFileDropped(event){
        let file;
        fileTypeValidator.check(event.data);
        file = fileTypeValidator.getFile();
        castManager.setFile(file);
        this.codeView.onFileDropped(file);
    }

    // When an audio file is recorded, it is transferred from the model to the view
    // to display a timeline entry
    onAudioRecorded(event){
        this.player.addEntry(event.data);
    }

    // Gets called when an Timeline/Player element gets deleted
    onEntryDelete(event){
        let entryID = event.data.data.attributes[1].value;
        castManager.deleteRecord(entryID);
    }

    // Gets called when an Timeline/Player element gets played
    onEntryPlay(event){
        let entryID = event.data;
        castManager.playRecord(entryID);
    }

    // Safes Cast in DB
    safeCast(event){
        castManager.setTitle(event.data);
        console.log(castManager.getCast());
    }
}

export default CastController;