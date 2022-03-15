/* eslint-env browser */
import AudioManager from "./AudioManager.js";
import RecordManager from "./RecordManager.js";
import Record from "./Record.js";
import { Event, Observable } from "../utils/Observable.js";
import { getUser } from "../../../app/src/api/User/getUser.js";
import { getFile } from "../../src/api/Storage/getFile.js";
import { deleteFile } from "../../src/api/Storage/deleteFile.js";
import { createFile } from "../../src/api/Storage/createFile.js";
import { listDocuments } from "../../../app/src/api/Collections/listDocuments.js";
import { updateDocument } from "../../../app/src/api/Collections/updateDocument.js";
import { createDocument } from "../../../app/src/api/Collections/createDocument.js";
import Config from "../utils/Config.js";

var audioManager,
    recordManager;

// Cast Model managing the data
class CastManager extends Observable {

    constructor() {
        super();
        this.file = null;
        this.title = "";
        this.castID = undefined; //TODO: if cast is loaded into CastManager -> replace castID with existing ID!
        this.codeFileID =
            undefined; //TODO: if cast is loaded into CastManager -> replace codeFileID with existing ID!


        // The last Record (Just a help variable for Record Creation)
        this.currentRecord = null;
        // The Audio manager creates audio files
        audioManager = new AudioManager();
        audioManager.addEventListener("audio-recorded", this.onAudioFileRecorded.bind(this));
        // These files are stored as records in the Record manager
        recordManager = new RecordManager();
        recordManager.addEventListener("audio-end", event => this.notifyAll(event));
        recordManager.addEventListener("audio-start", event => { this.notifyAll(event); });
        recordManager.addEventListener("cast-end", event => { this.notifyAll(event); });
    }

    //the current file for the codecast
    setFile(file) {
        this.file = file;
    }

    // Sets current cast title
    setTitle(string) {
        this.title = string;
    }

    //starts the record in the audioManager
    startRecord() {
        audioManager.record();
    }

    //stops the record and stores title and time in a new Record object
    stopRecord(event) {
        this.currentRecord = new Record(event.data.title, event.data.time);
        audioManager.stopRecord();
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

    //adds Audio to the current Record object and informs the CastController
    onAudioFileRecorded(event) {
        this.currentRecord.setAudio(event.data);
        let ev = new Event("audio-recorded", this.currentRecord);
        this.notifyAll(ev);
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

    // Returns all the data from the current cast -> So it can be stored
    saveCast(title, codeHTML) {
        return saveCast(title, codeHTML);
    }

}

// Creates JSON with data from the current cast
//TODO: needs UserID (serverID)
//TODO: needs AudioIDs (serverIDs)
//TODO: needs CodeFileID (serverID)
async function saveCast(title, codeHTML, audioFileIDs) {
    let user = await getUser(),
        allCasts = await listDocuments(),
        castServerID,
        castDocumentJSON;
    if (this.castID) {
        allCasts.forEach(castDoc => {
            if (castDoc.castID === this.castID) {
                castServerID = castDoc.$id;
            }
        });
    } else {
        this.castID = crypto.randomUUID() + "_cast";
    }

    if (this.codeFileID) {
        //delete -> to "update"
        await deleteFile(this.codeFileID);
    } else {
        this.codeFileID = crypto.randomUUID() + "_code";
    }
    await saveCodeAsFileToServer(codeHTML);

    castDocumentJSON = {
        castID: this.castID,
        title: title,
        userID: user,
        codeFileID: this.codeFileID,
        audioFileIDs: audioFileIDs,
    };

    if (castServerID) { //if the cast was already once saved in the cloud then update and don't create a new one
        await updateDocument(Config.CAST_COLLECTION_ID, castServerID, castDocumentJSON); //TODO: fehlt
    } else { //create a new castDocument on the server
        await createDocument(Config.CAST_COLLECTION_ID, castDocumentJSON);
    }
    //TODO: send to cloud -> update or create
}

//https://redstapler.co/generate-text-file-javascript/ Abgerufen am 15.03.22
async function saveCodeAsFileToServer(codeHTML) {
    let blob = new Blob([codeHTML], { type: "text/plain;charset=utf-8" }),
        file = new File([blob], this.codeFileID, { type: "text/plain;charset=utf-8" });
    await createFile(this.codeFileID, file);
}

export default CastManager;