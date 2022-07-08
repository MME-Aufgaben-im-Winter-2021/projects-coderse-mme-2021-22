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
import { generateAdModal, generateIntroModal } from "../view/utilViews/Modal.js";
import LocalStorageProvider from "../utils/LocalStorageProvider.js";
import CanvasView from "../view/cast/CodeField/CanvasView.js";

var castManager;

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
        castManager.addEventListener("cast-reached-cloud", this.castReachedCloud.bind(this));

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
        this.recorder.addEventListener("remove-current-marking", this.removeCurrentMarking.bind(this));
        this.recorder.addEventListener("disable-syntax", this.disableSyntaxHighlighting.bind(this));
        this.recorder.addEventListener("enable-syntax", this.enableSyntaxHighlighting.bind(this));

        // Code View
        this.codeView = new CodeView();
        this.codeView.addEventListener("marking-mouse-over", (e) => this.playerList.onMouseOverMarking(e));
        this.codeView.addEventListener("marking-mouse-out", (e) => this.playerList.onMouseOutMarking(e));
        this.codeView.addEventListener("code-help-clicked", this.onHelpClicked.bind(this));
        this.codeView.addEventListener("disable-syntax", this.disableSyntaxHighlighting.bind(this));
        this.codeView.addEventListener("enable-syntax", this.enableSyntaxHighlighting.bind(this));

        this.file = "";

        // Canvas
        this.canvasView = new CanvasView();

        // Drop View
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready-txt", this.onFileReadyTxt.bind(this));
        this.dropView.addEventListener("file-ready-pdf", this.onFileReadyPdf.bind(this));
        this.dropView.addEventListener("file-ready-pic", this.onFileReadyPic.bind(this));
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

        this.computeOnboarding(id);
    }

    // User wants to do the on boarding again
    onHelpClicked() {
        LocalStorageProvider.setCreateCastOnBoarding("start");
        if (this.dropView.hidden) {
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
            generateIntroModal(
                "Load your code!",
                `Start your cast by choosing a file you'd like to describe and share. 
                You can either 
                <strong>drag and drop</strong> or 
                <strong>load</strong> your code-file 
                from your explorer.`);
            LocalStorageProvider.setCreateCastOnBoarding("drag-done");
        }
    }
    // Tutorial of the cast-screen. Shows up at first opening or by clicking on the questionmark-button
    showAdvancedIntro() {
        let onBoardingDone = LocalStorageProvider.getCreateCastOnBoarding();
        if (onBoardingDone === "drag-done") {
            LocalStorageProvider.setCreateCastOnBoarding("done");
            let markingsModal, toolsModal, voiceRecordingsModal, editRecordingsModal, listenToCastModal,
                saveCastModal;

            saveCastModal = generateIntroModal("Save your cast",
                `Click the "Save" button in the top left corner, to save your cast. <br> 
                You can still come back later to edit this cast.`);

            listenToCastModal = generateIntroModal("Listen to your cast",
                `On the <strong> left side </strong> you can later see your recordings. <br>
                Listen through all your records, and navigate between them.`,
                saveCastModal);

            editRecordingsModal = generateIntroModal("Edit your recordings",
                `Hover over audios to see which marked code snippet belongs to it. <br>
                    Listen to your records, change their title or delete them. <br>
                    Grab one to change the order.`,
                listenToCastModal);

            toolsModal = generateIntroModal("Tools",
                `At the bottom between the player controls and the audio controls you see the <b>toolbar</b>. <br>
                 By pressing on the delete button you can remove the current marking you made in the text. <br>
                 Alternatively use <b><i>CTRL + Z</i></b>.<br><hr><br>
                 If you click on the <b>eye icon</b>, you can toggle the visibility of the automatic syntax highlighting.`,
                editRecordingsModal);

            voiceRecordingsModal = generateIntroModal("Add voice recordings",
                `At the <strong> bottom right corner </strong> you can create a <strong>voice recording</strong>. <br>
                    If you've marked code, the audio will be connected to it after you saved it. 
                    Before saving the audio, you can still make further markings that will be added. 
                    Additionally you can <strong> customize the audio title</strong>.`,
                toolsModal);

            markingsModal = generateIntroModal("Code markings",
                `Select ranges of text or code you want to describe by audio recordings.<br> 
                Selected codeparts <strong>change their color</strong> and are then are <mark class="marking">lightblue</mark>.`,
                voiceRecordingsModal);

            generateIntroModal("Cast title",
                `In the top left corner, you can give your cast a custom name.`,
                markingsModal);
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

    castReachedCloud() {
        this.navView.removeLoadingAnimation();
        this.notifyAll(new Event("switch-to-homescreen", "switch to homescreen"));
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

    // sends new title-input to cast manager
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

    removeCurrentMarking() {
        this.codeView.removeUnconnectedMarkings();
    }

    disableSyntaxHighlighting() {
        this.codeView.disableHighlighting();
    }

    enableSyntaxHighlighting() {
        this.codeView.enableHighlighting();
    }

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

    onFileReadyTxt(event) {
        this.file = "text";
        this.showAdvancedIntro();
        this.codeView.showFile(event.data);
        this.computeOnboarding();
    }

    onFileReadyPdf(event) {
        this.file = "pdf";
        this.canvasView.setDocument(event.data);
        this.canvasView.showPdf();
        this.showAdvancedIntro();
        this.computeOnboarding();
    }

    onFileReadyPic(event) {
        this.file = "image";
        this.textFile = false;
        this.canvasView.setPictureUrl(event.data);
        this.canvasView.showPicture();
    }

    // Validator checks dropped file
    // File is stored in cast manager model
    // File is handed to view 
    onFileDropped(event) {
        let file;
        FileTypeValidator.check(event.data);
        file = FileTypeValidator.getFile();
        this.dropView.onFileDropped(file);
        this.navView.showTitle(file.name);
        castManager.setTitle(file.name);
    }

    onFileSelected(event) {
        let file = event.data;
        if (FileTypeValidator.checkValidFileType(file)) {
            this.dropView.onFileDropped(file);
            this.dropView.showButton();
            this.navView.showTitle(file.name);
            castManager.setTitle(file.name);
        } else {
            this.dropView.onFileDropped(null);
            this.dropView.hideButton();
        }
    }

    /* ---------------------------------------------------navView--------------------------------------------------------------- */

    // Safes cast to cloud
    safeCast() {
        castManager.checkForModal();
        if(this.file === "text"){
            castManager.saveCastText(this.codeView.getHTML());
        } else if(this.file === "pdf") {
            castManager.saveCastPDF(this.canvasView.getPDF());
        } else if(this.file === "image") {
            castManager.saveCastImage(this.canvasView.getImage());
        }
    }
    // Sets changed title
    onCastTitleChanged(event) {
        castManager.setTitle(event.data);
    }

    /* --------------------------------------------------- Hide Edit Options for a Share View --------------------------------------------------------------- */

    setShareScreen(name) {
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.codeView.hideFabHelp();
        this.navView.disableTitleInput();
        this.navView.showCreatorName(name);
        this.recorder.hideRecorder();
        this.playerList.hideEditable();
        this.playerList.disableDragAndDrop();
        this.codeView.startShareViewMode();
        this.codeView.showSyntaxFab();
        generateAdModal.call(this);
    }

}

export default CastController;