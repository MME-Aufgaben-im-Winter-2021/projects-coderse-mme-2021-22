/* eslint-env browser */

import PlayerListView from "../view/cast/AudioPlayer/PlayerListView.js";
import PlayerControlsView from "../view/cast/AudioPlayer/PlayerControlsView.js";
import RecorderView from "../view/cast/AudioRecorder/RecorderView.js";
import CodeView from "../view/cast/CodeField/CodeView.js";
import CastManager from "../model/cast/CastManager.js";
import FileTypeValidator from "../utils/FileTypeValidator.js";
import DropView from "../view/cast/CodeField/DropView.js";
import { Observable, Event } from "../utils/Observable.js";
import Cast from "../model/cast/Cast.js";

import LocalStorageProvider from "../utils/LocalStorageProvider.js";

var castManager,
    introJs = window.introJs;

// Controller to link data and views on the Cast Creation page
// Connects Views and Models with events -> Communication

class CastController extends Observable {

    init(navView, id) {

        // General model for a cast. Combines multiple models
        castManager = new CastManager(navView.getCastTitle());
        castManager.addEventListener("audio-saved", this.onAudioSaved.bind(this));
        castManager.addEventListener("audio-recorded", this.onAudioRecorded.bind(this));
        castManager.addEventListener("audio-start", this.startPlayedEntry.bind(this));
        castManager.addEventListener("audio-end", this.endPlayedEntry.bind(this));
        castManager.addEventListener("cast-end", this.onCastEnded.bind(this));
        castManager.addEventListener("cast-downloaded", this.onCastDownloaded.bind(this));
        castManager.addEventListener("audio-downloaded", this.onAudioDownloaded.bind(this));
        castManager.addEventListener("codeHTML-downloaded", this.onCodeHTMLDownloaded.bind(this));
        castManager.addEventListener("modal-stop", this.onAudioModalStopAudioClicked.bind(this));
        castManager.addEventListener("modal-delete", this.onAudioModalDeleteClicked.bind(this));

        // Audio Player - Timeline for the Cast
        this.playerList = new PlayerListView();
        this.playerList.addEventListener("entry-delete", this.onEntryDelete.bind(this));
        this.playerList.addEventListener("entry-play", this.onEntryPlay.bind(this));
        this.playerList.addEventListener("entry-stop", this.onEntryStop.bind(this));
        this.playerList.addEventListener("mouse-over-player-entry", this.onHoverOverPlayerEntry.bind(this));
        this.playerList.addEventListener("mouse-out-player-entry", this.onMouseLeavePlayerEntry.bind(this));
        this.playerList.addEventListener("entry-title-changed", this.onEntryTitleChanged.bind(this));
        this.playerList.addEventListener("on-record-list-changed", this.onRecordListChanged.bind(this));

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
        this.codeView.addEventListener("marking-mouse-over", (e) => this.playerList.onMouseOverMarking(e));
        this.codeView.addEventListener("marking-mouse-out", (e) => this.playerList.onMouseOutMarking(e));

        // Drop View
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready", this.onFileReady.bind(this));
        this.dropView.addEventListener("file-dropped", this.onFileDropped.bind(this));
        this.dropView.addEventListener("file-selected", this.onFileSelected.bind(this));

        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.showSafeBtn();
        this.navView.showTitleInput();
        this.navView.setCreateActive();
        this.navView.addEventListener("onCastTitleChanged", this.onCastTitleChanged.bind(this));

        castManager.getCast(id);

        this.fabHelp = document.querySelector(".fab-help");
        this.fabHelp.addEventListener("click", this.onHelpClicked.bind(this));

        this.computeOnboarding(id);
    }

    // User wants to do the on boarding again
    onHelpClicked(){
        LocalStorageProvider.setCreateCastOnBoarding("start");
        if(this.dropView.hidden){
            LocalStorageProvider.setCreateCastOnBoarding("drag-done");
            this.showAdvancedIntro();
        } else {
            this.computeOnboarding(false);
        }
    }

    // If the LocalStorage value is undefined = users first time using the app -> Onboarding starts
    computeOnboarding(id) {
        // If it is a share screen, onboarding is not needed
        if (id) {
            LocalStorageProvider.setCreateCastOnBoarding("done");
        }
        let onBoardingDone = LocalStorageProvider.getCreateCastOnBoarding();
        if (onBoardingDone === null || onBoardingDone === "start") {
            introJs().setOptions({
                steps: [{
                    title: "Load your Code!",
                    intro: "<strong>Drag and Drop</strong> or <strong> Load </strong> your code file from explorer.",
                    element: document.querySelector(".main-right-drag-drop-container"),
                }],
                tooltipClass: "custom-tooltip",
            }).start();
            LocalStorageProvider.setCreateCastOnBoarding("drag-done");
        }
    }

    showAdvancedIntro() {
        let onBoardingDone = LocalStorageProvider.getCreateCastOnBoarding();
        if (onBoardingDone === "drag-done") {
            LocalStorageProvider.setCreateCastOnBoarding("done");
            introJs().setOptions({
                steps: [{
                    title: "Mark important Code!",
                    intro: "<strong>Mark by selecting Code </strong>",
                    element: document.querySelector(".main-right"),
                }, {
                    title: "Record Audio-Messages!",
                    intro: "<strong>Record messages</strong> which explain your currently marked code. </br> You can give them a name, too!",
                    element: document.querySelector(".bottom-right"),
                }, {
                    title: "Edit your recordings!",
                    intro: "Listen to your records, change their title or delete them.",
                    element: document.querySelector(".main-left"),
                }, {
                    title: "Listen to your Cast!",
                    intro: "Listen through all your records, and navigate between them.",
                    element: document.querySelector(".bottom-left"),
                }, {
                    title: "Safe your first Cast!",
                    intro: "<strong>Click here </strong> to safe your cast. </br> You are able to edit it afterwards!",
                    element: document.querySelector(".button-save"),
                }],
                tooltipClass: "custom-tooltip",
            }).start();
        }
    }

    /* ---------------------------------------------------castManager--------------------------------------------------------------- */

    // When the Cast is fetched from the DB, we want to setup the Audio Entries and the Code file
    onCastDownloaded(event) {
        let castJSON = event.data,
            cast = new Cast(castJSON.title);
        cast.codeFileID = castJSON.codeFileID;
        cast.castServerID = castJSON.$id;
        cast.records = castJSON.records;
        castManager.onCastDownloaded(cast);
        this.navView.showTitle(castJSON.title);
        this.dropView.hide();
    }

    // When all Audio Files (Records) are turned to actual Record.js Objects this method will be invoked
    // Now all the Audio Player Entries show and are playable
    onAudioDownloaded(event) {
        let recordData = event.data;
        for (let record of recordData) {
            castManager.addRecord(record);
        }
        this.notifyAll(new Event("content-load", "content loaded"));
    }

    // When the Code file is fetched, this Method will be invoked to set the code container
    onCodeHTMLDownloaded(event) {
        let codeHTML = event.data;
        this.codeView.showLoadedFile(codeHTML);
    }

    // When an audio file is recorded, it is transferred from the model to the view
    // to display a timeline entry
    onAudioSaved(event) {
        let currRecord = event.data,
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

    onAudioModalStopAudioClicked() {
        this.recorder.onStopRecordingClicked();
        this.recorder.onSaveRecordingClicked();
        this.safeCast();
    }

    onAudioModalDeleteClicked() {
        this.recorder.onStopRecordingClicked();
        this.recorder.onTrashClicked();
        this.safeCast();
    }

    /* ---------------------------------------------------playerList--------------------------------------------------------------- */

    // Gets called when an Timeline/Player element gets deleted
    onEntryDelete(event) {
        let entryID = event.data.data.attributes[1].value;
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

    // sends new title-input to castmanager
    onEntryTitleChanged(event) {
        let data = event.data;
        castManager.onEntryTitleChanged(data);
    }

    onRecordListChanged(event) {
        castManager.onRecordListChanged(event.data);
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
        if (!this.playerList.hasNoEntries()) {
            castManager.onNextRecord();
        }
    }

    // Get to the previous record
    onPreviousRecord() {
        if (!this.playerList.hasNoEntries()) {
            castManager.onPreviousRecord();
        }
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

    checkForRunningAudio() {
        castManager.checkForModal();
    }

    /* ---------------------------------------------------dropView--------------------------------------------------------------- */

    onFileReady(event) {
        this.showAdvancedIntro();
        this.codeView.showFile(event.data);
        this.computeOnboarding();
    }

    // Validator checks dropped file
    // File is stored in Cast Manager model
    // File is handed to View 
    onFileDropped(event) {
        let file;
        FileTypeValidator.check(event.data);
        file = FileTypeValidator.getFile();
        this.dropView.onFileDropped(file);
    }

    onFileSelected(event) {
        let file = event.data;
        if (FileTypeValidator.checkValidFileType(file)) {
            this.dropView.onFileDropped(file);
            this.dropView.showButton();
        } else {
            this.dropView.onFileDropped(null);
            this.dropView.hideButton();
        }
    }

    /* ---------------------------------------------------navView--------------------------------------------------------------- */

    // Safes Cast to Cloud
    safeCast() {
        castManager.saveCast(this.codeView.getHTML());
    }

    onCastTitleChanged(event) {
        castManager.setTitle(event.data);
    }

    /* --------------------------------------------------- Hide Edit Options for a Share View --------------------------------------------------------------- */

    setShareScreen(name) {
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.fabHelp.classList.add("hidden");
        this.navView.showCreatorName(name);
        this.recorder.hideRecorder();
        this.playerList.hideEditable();
        this.playerList.disableDragAndDrop();
        this.codeView.startShareViewMode();
        this.navView.disableTitleInput();
    }

}

export default CastController;