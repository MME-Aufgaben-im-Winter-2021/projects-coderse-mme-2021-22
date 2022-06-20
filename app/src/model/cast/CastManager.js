/* eslint-env browser */
import Cast from "./Cast.js";
import AudioManager from "./AudioManager.js";
import RecordManager from "./RecordManager.js";
import Record from "./Record.js";
import { Event, Observable } from "../../utils/Observable.js";
import { getUser } from "../../api/User/getUser.js";
import { updateDocument } from "../../api/Collections/updateDocument.js";
import { createDocument } from "../../api/Collections/createDocument.js";
import { getDocument } from "../../api/Collections/getDocument.js";
import { deleteFile } from "../../api/Storage/deleteFile.js";
import { createFile } from "../../api/Storage/createFile.js";
import { getFile } from "../../api/Storage/getFile.js";
import Config from "../../utils/Config.js";
import Modal from "../../view/utilViews/Modal.js";

var audioManager,
    recordManager;

const uuid = window.uuidv4;

// Cast Model managing the data
class CastManager extends Observable {

    constructor(title) {
        super();
        // The last record (Just a help variable for record creation)
        this.currentRecord = null;
        // The Audio manager creates audio files
        audioManager = new AudioManager();
        audioManager.addEventListener("audio-recorded", this.onAudioFileRecorded.bind(this));
        // These files are stored as records in the Record manager
        recordManager = new RecordManager();
        recordManager.addEventListener("audio-end", event => this.notifyAll(event));
        recordManager.addEventListener("audio-start", event => { this.notifyAll(event); });
        recordManager.addEventListener("cast-end", event => { this.notifyAll(event); });

        this.cast = new Cast(title);
    }

    setTitle(title) {
        this.cast.setTitle(title);
    }

    setCastServerID(id) {
        this.cast.castServerID = id;
    }

    setCodeFileID(id) {
        this.cast.codeFileID = id;
    }

    // Starts the record in the audio manager
    startRecord() {
        audioManager.record();
    }

    //Stops the record and stores title and time in a new record object
    stopRecord(event) {
        this.currentRecord = new Record(event.data.title, event.data.time);
        audioManager.stopRecord();
    }

    addRecord(record) {
        recordManager.addRecord(record);
        let ev = new Event("audio-saved", record);
        this.notifyAll(ev);
    }

    saveRecord(event) {
        this.currentRecord.title = event.data.title;
        this.currentRecord.time = event.data.time;
        recordManager.addRecord(this.currentRecord);
        let ev = new Event("audio-saved", this.currentRecord);
        this.notifyAll(ev);
    }

    deleteRecord(id) {
        recordManager.deleteRecord(id);
    }

    playRecord(id) {
        recordManager.playRecord(id);
    }

    stopPlayRecord(id) {
        recordManager.stopRecord(id);
    }

    // Adds audio to the current record object and informs the CastController
    onAudioFileRecorded(event) {
        if (event.data) {
            this.currentRecord.setAudio(event.data);
            let ev = new Event("audio-recorded", this.currentRecord);
            this.notifyAll(ev);
        }
    }

    // Plays the whole cast
    playCast() {
        recordManager.playCast();
    }

    stopCast() {
        recordManager.stopCast();
    }

    onNextRecord() {
        recordManager.onNextRecord();
    }

    onPreviousRecord() {
        recordManager.onPreviousRecord();
    }

    onEntryTitleChanged(data) {
        recordManager.onEntryTitleChanged(data);
    }

    onRecordListChanged(recordIDs) {
        recordManager.onRecordListChanged(recordIDs);
    }

    checkForModal() {
        let modal;
        if (audioManager.mediaRecorderIsRecording()) {
            modal = new Modal("Audio still recording",
                "There is an audio recording running currently. Stop and save recording?",
                "Yes, save", "No, discard audio");
            modal.addEventListener("onAcceptClicked", () => this.notifyAll(new Event("modal-stop", "")));
            modal.addEventListener("onDeclineClicked", () => this.notifyAll(new Event("modal-delete", "")));
        }
    }

    saveCastText(codeHTML) {
        saveCastText(this.cast.getTitle(), codeHTML, this);
    }

    saveCastPDF(pdf) {
        console.log(pdf);
        saveCastCanvas(this.cast.getTitle(), pdf.pdf, this, "pdf");
    }

    saveCastImage(image) {
        console.log(image);
        saveCastCanvas(this.cast.getTitle(), image.imageURL, this, "img");
    }

    onCastDownloaded(cast) {
        this.cast = cast;
        this.getAudios(this.cast.records);
        this.getCodeText(this.cast.codeFileID);
    }

    // If the user wants to edit a cast, the id is not undefined
    async getCast(id) {
        if (id) {
            // So we fetch the cast from the DB
            let cast = await downloadCast(id);
            this.notifyAll(new Event("cast-downloaded", cast));
        }
    }

    // Retrieves audio files from the Database, and creates playable Records
    async getAudios(records) {
        let audioData = [],
            recordData = [];
        for (let record of records) {
            audioData.push(JSON.parse(record));
        }
        for (let audio of audioData) {
            let record = new Record(audio.title, audio.time),
                fileURL = await downloadFile(audio.id),
                blob;
            blob = await fetch(fileURL.href).then(r => r.blob());
            record.id = audio.id;
            record.setAudio(URL.createObjectURL(blob));
            recordData.push(record);
        }
        this.notifyAll(new Event("audio-downloaded", recordData));
    }

    // Retrieves a code file from the DataBase
    async getCodeText(codeFileID) {
        let codeFile = await downloadFile(codeFileID),
            reader = new FileReader();
        if (codeFile !== null) {
            fetch(codeFile.href).then(res => res.blob()).then(blob => {
                let file = new File([blob], "CodeFile");
                reader.readAsText(file);
            });
        }

        reader.onload = (res) => {
            let text = res.target.result;
            this.notifyAll(new Event("codeHTML-downloaded", text));
        };
    }

}

async function downloadFile(id) {
    return await getFile(id);
}

async function downloadCast(id) {
    let cast = await getDocument(Config.CAST_COLLECTION_ID, id);
    return cast;
}

function setNewCodeFileID(self) {
    let substring = 14;
    self.cast.setCodeFileID(uuid().substring(substring) + "_code.txt");
}

function setNewCanvasFileID(self, fileType) {
    let substring = 14;
    self.cast.setCodeFileID(uuid().substring(substring) + "_canvas." + fileType);
}

// Creates JSON with data from the current cast
async function saveCastText(title, codeHTML, self) {
    let user = await getUser(),
        castDocumentJSON,
        records,
        doesCastExistInCloud;

    if (self.cast.castServerID) {
        doesCastExistInCloud = true;
    } else {
        doesCastExistInCloud = false;
    }

    if (!self.cast.codeFileID) {
        setNewCodeFileID(self);
    }

    deleteFile(self.cast.codeFileID).then();
    setNewCodeFileID(self);
    saveCodeAsFileToServer(codeHTML, self).then();

    records = await recordManager.createDBRecord();
    self.cast.setRecords(records);

    castDocumentJSON = self.cast.getJSON(user);
    if (doesCastExistInCloud) { //if the cast was already once saved in the cloud then update and don't create a new one
        await updateDocument(Config.CAST_COLLECTION_ID, self.cast.castServerID, castDocumentJSON)
        .then(self.notifyAll(new Event("cast-reached-cloud","cast reached cloud")));
    } else { //create a new castDocument on the server
        await createDocument(Config.CAST_COLLECTION_ID, castDocumentJSON)
        .then(self.notifyAll(new Event("cast-reached-cloud","cast reached cloud")));
    }
}

// Creates JSON with data from the current cast
async function saveCastCanvas(title, blob, self, fileType) {
    let user = await getUser(),
        castDocumentJSON,
        records,
        doesCastExistInCloud;

    if (self.cast.castServerID) {
        doesCastExistInCloud = true;
    } else {
        doesCastExistInCloud = false;
    }

    if (!self.cast.codeFileID) {
        setNewCanvasFileID(self, fileType);
    }

    deleteFile(self.cast.codeFileID).then();
    setNewCanvasFileID(self, fileType);
    saveCanvasAsFileToServer(blob, self).then();

    records = await recordManager.createDBRecord();
    self.cast.setRecords(records);

    castDocumentJSON = self.cast.getJSON(user);
    if (doesCastExistInCloud) { //if the cast was already once saved in the cloud then update and don't create a new one
        await updateDocument(Config.CAST_COLLECTION_ID, self.cast.castServerID, castDocumentJSON)
        .then(self.notifyAll(new Event("cast-reached-cloud","cast reached cloud")));
    } else { //create a new castDocument on the server
        await createDocument(Config.CAST_COLLECTION_ID, castDocumentJSON)
        .then(self.notifyAll(new Event("cast-reached-cloud","cast reached cloud")));
    }
}

//https://redstapler.co/generate-text-file-javascript/ aufgerufen am 15.03.22
async function saveCodeAsFileToServer(codeHTML, self) {
    let blob = new Blob([codeHTML], { type: "text/plain;charset=utf-8" }),
        file = new File([blob], self.cast.codeFileID, { type: "text/plain;charset=utf-8" });
    await createFile(self.cast.codeFileID, file);
}

async function saveCanvasAsFileToServer(url, self) {
    let blob = await fetch(url).then(r => r.blob()),
        file = new File([blob], self.cast.codeFileID);
    await createFile(self.cast.codeFileID, file);
}

export default CastManager;