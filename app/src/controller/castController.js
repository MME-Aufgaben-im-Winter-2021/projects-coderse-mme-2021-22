/* eslint-env browser */

import PlayerListView from "../view/cast/AudioPlayer/PlayerListView.js";
import PlayerControlsView from "../view/cast/AudioPlayer/PlayerControlsView.js";
import RecorderView from "../view/cast/AudioRecorder/RecorderView.js";
import NavView from "../view/cast/Navbar/NavView.js";
import CodeView from "../view/cast/CodeField/CodeView.js";
import CastManager from "../model/castManager.js";
import FileTypeValidator from "../utils/FileTypeValidator.js";

var castManager;

// Controller to link data and views on the Cast Creation page
// Connects Views and Models with events -> Communication

class CastController {

    constructor() {
        // General model for a cast. Combines multiple models
        castManager = new CastManager();
        castManager.addEventListener("audio-saved", this.onAudioSaved.bind(this));
        castManager.addEventListener("audio-recorded", this.onAudioRecorded.bind(this));
        castManager.addEventListener("audio-start", this.startPlayedEntry.bind(this));
        castManager.addEventListener("audio-end", this.endPlayedEntry.bind(this));
        castManager.addEventListener("cast-end", this.onCastEnded.bind(this));

        // Audio Player - Timeline for the Cast
        this.playerList = new PlayerListView();
        this.playerList.addEventListener("entry-delete", this.onEntryDelete.bind(this));
        this.playerList.addEventListener("entry-play", this.onEntryPlay.bind(this));
        this.playerList.addEventListener("entry-stop", this.onEntryStop.bind(this));
        this.playerList.addEventListener("mouse-over-player-entry", this.onHoverOverPlayerEntry.bind(this));
        this.playerList.addEventListener("mouse-out-player-entry", this.onMouseLeavePlayerEntry.bind(this));
        this.playerList.addEventListener("entry-title-changed", this.onEntryTitleChanged.bind(this));

        // Audio Player - Controls
        this.playerControls = new PlayerControlsView();
        this.playerControls.addEventListener("play-records", this.onPlayRecords.bind(this));
        this.playerControls.addEventListener("stop-records", this.onStopRecords.bind(this));
        this.playerControls.addEventListener("previous-record", this.onPreviousRecord.bind(this));
        this.playerControls.addEventListener("next-record", this.onNextRecord.bind(this));
        // Audio Recorder
        this.recorder = new RecorderView();
        this.recorder.addEventListener("send-recording", this.onRecordingSend.bind(this));
        this.recorder.addEventListener("start-recording", this.onRecordingStart.bind(this));
        this.recorder.addEventListener("stop-recording", this.onRecordingStop.bind(this));
        this.recorder.addEventListener("delete-recording", this.onRecordingDelete.bind(this));
        this.recorder.addEventListener("save-recording", this.onRecordingSave.bind(this));

        // Code View
        this.codeView = new CodeView();
        this.codeView.addEventListener("file-dropped", this.onFileDropped.bind(this));
        this.codeView.addEventListener("file-selected", this.onFileSelected.bind(this));
        this.codeView.addEventListener("marking-mouse-over", (e) => this.playerList.onMouseOverMarking(e));
        this.codeView.addEventListener("marking-mouse-out", (e) => this.playerList.onMouseOutMarking(e));

        // Navbar View
        this.navView = new NavView();
        this.navView.addEventListener("cast-safe", this.safeCast.bind(this));
    }
    
/* ---------------------------------------------------castManager--------------------------------------------------------------- */

    // When an audio file is recorded, it is transferred from the model to the view
    // to display a timeline entry
    onAudioSaved() {
        let currRecord = castManager.currentRecord,
            id = currRecord.id;
        this.playerList.addEntry(currRecord);
        this.codeView.assignNewMarkings(id);
    }

    //When the audio is ready the option to save it is shown
    onAudioRecorded() {
        // this.playerList.addEntry(event.data);
        this.recorder.showIconSave();
    }

    startPlayedEntry(event) {
        this.playerList.startPlayedEntry(event);
        this.codeView.highlightPlayMarking(event.data.getID());
    }
    
    endPlayedEntry(event) {
        this.playerList.endPlayedEntry(event);
        this.codeView.resetPlayMarking(event.data.getID());
    }
    
    onCastEnded() {
        this.playerControls.resetIcons();
    }

/* ---------------------------------------------------playerList--------------------------------------------------------------- */

    // Gets called when an Timeline/Player element gets deleted
    onEntryDelete(event) {
        let entryID = event.data.data.attributes[1].value;
        //event.data.getAttribute("data-id");
        console.log("ID to delete: ", entryID);
        castManager.deleteRecord(entryID);
        this.codeView.removeMarkingsById(entryID);
    }

    // Gets called when an Timeline/Player element gets played
    onEntryPlay(event) {
        let entryID = event.data;
        castManager.playRecord(entryID);
        this.codeView.highlightPlayMarking(entryID);
    }

    // Gets called when an Timeline/Player element gets played
    onEntryStop(event) {
        let entryID = event.data;
        castManager.stopPlayRecord(entryID);
        this.playerControls.resetIcons();
        this.codeView.resetPlayMarking(entryID);
    }

    //highlight code when hovering over player entry
    onHoverOverPlayerEntry(event) {
        let id = event.data;
        this.codeView.highlightMarking(id);
    }

    //reset highlight when mouse leaves player entry
    onMouseLeavePlayerEntry(event) {
        let id = event.data;
        this.codeView.resetMarking(id);
    }

    onEntryTitleChanged(event){
        let data = event.data;
        castManager.onEntryTitleChanged(data);
    }

/* ---------------------------------------------------playerControls--------------------------------------------------------------- */
    // Play the cast when player controller view recognizes a click
    onPlayRecords() {
        if (this.playerList.hasNoEntries()) {
            this.playerControls.resetIcons();
        } else {
            castManager.playCast();
        }
    }

    // Stop the cast when player controller view recognizes a click
    onStopRecords() {
        castManager.stopCast();
    }

    // Skip to the next record
    onNextRecord() {
        castManager.onNextRecord();
    }

    // Get to the previous record
    onPreviousRecord() {
        castManager.onPreviousRecord();
    }
    

/* ---------------------------------------------------recorder--------------------------------------------------------------- */

    // Function for communication between player and recorder
    onRecordingSend(event) {
        castManager.saveRecord(event);
    }
    // Function for communication between player and recorder
    onRecordingStart() {
        castManager.startRecord();
    }

    // Function for communication between player and recorder
    onRecordingStop(event) {
        castManager.stopRecord(event);
    }

    // Function for communication between player and recorder
    onRecordingDelete() {
        this.recorder.stopTimer();
        this.codeView.removeUnconnectedMarkings();
    }
    onRecordingSave(event) {
        castManager.saveRecord(event);
    }

/* ---------------------------------------------------codeView--------------------------------------------------------------- */

    // Validator checks dropped file
    // File is stored in Cast Manager model
    // File is handed to View 
    onFileDropped(event) {
        let file;
        FileTypeValidator.check(event.data);
        file = FileTypeValidator.getFile();
        castManager.setFile(file);
        this.codeView.onFileDropped(file);
    }

    onFileSelected(event) {
        let file = event.data;
        if (FileTypeValidator.checkValidFileType(file)) {
            castManager.setFile(file);
            this.codeView.onFileDropped(file);
            this.codeView.showButton();
        } else {
            this.codeView.onFileDropped(null);
            this.codeView.hideButton();
        }
    }
    
/* ---------------------------------------------------navView--------------------------------------------------------------- */

    // Safes Cast in DB
    safeCast(event) {
        castManager.setTitle(event.data);
    }
}

export default CastController;