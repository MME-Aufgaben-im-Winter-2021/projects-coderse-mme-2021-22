/* eslint-env browser */
import AudioManager from "./AudioManager.js";
import RecordManager from "./RecordManager.js";
import Record from "./Record.js";
import { Event, Observable } from "../../utils/Observable.js";
import { getUser } from "../../api/User/getUser.js";
import { listDocuments } from "../../api/Collections/listDocuments.js";
import { updateDocument } from "../../api/Collections/updateDocument.js";
import { createDocument } from "../../api/Collections/createDocument.js";
import Config from "../../utils/Config.js";

var audioManager,
    recordManager;

// Cast Model managing the data
class CastManager extends Observable {

    constructor() {
        super();
        this.file = null;
        this.title = "";
        this.castID = undefined; //TODO: if cast is loaded into CastManager -> replace castID with existing ID!
        this.codeFileID = undefined; //TODO: if cast is loaded into CastManager -> replace codeFileID with existing ID!

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
    async saveCast(title, codeHTML) {
        return await saveCast(title, codeHTML, this);
    }

}

// Creates JSON with data from the current cast
//TODO: needs UserID (serverID)
//TODO: needs AudioIDs (serverIDs)
//TODO: needs CodeFileID (serverID)
async function saveCast(title, codeHTML, self) {
    let user = await getUser(),
        allCasts = await listDocuments(Config.CAST_COLLECTION_ID),
        castServerID,
        castDocumentJSON,
        recordIDs,
        userID = user.$id;
    if (self.castID) {
        allCasts.forEach(castDoc => {
            if (castDoc.castID === self.castID) {
                castServerID = castDoc.$id;
            }
        });
    }
    //  else {
    //     self.castID = crypto.randomUUID() + "_cast";
    // }

    if (self.codeFileID) {
        //delete -> to "update"
        // await deleteFile(self.codeFileID);
    }
    // else {
    //     self.codeFileID = crypto.randomUUID() + "_code";
    // }
    // await saveCodeAsFileToServer(codeHTML, self);
    self.codeFileID = "idReturnedFrom the creation of the file";
    self.castID = "die ist doch unnötig - erstellt doch eh eine";

    recordIDs = await recordManager.createDBRecord();
    castDocumentJSON = {
        castID: self.castID,
        title: title,
        userID: userID,
        codeFileID: self.codeFileID,
        audioFileIDs: recordIDs,
    };

    if (castServerID) { //if the cast was already once saved in the cloud then update and don't create a new one
        await updateDocument(Config.CAST_COLLECTION_ID, castServerID, castDocumentJSON); //TODO: fehlt
    } else { //create a new castDocument on the server
        await createDocument(Config.CAST_COLLECTION_ID, castDocumentJSON);
    }
    //TODO: send to cloud -> update or create
}

//https://redstapler.co/generate-text-file-javascript/ Abgerufen am 15.03.22
// async function saveCodeAsFileToServer(codeHTML, self) {
//     let blob = new Blob([codeHTML], { type: "text/plain;charset=utf-8" }),
//         file = new File([blob], self.codeFileID, { type: "text/plain;charset=utf-8" });
//     await createFile(self.codeFileID, file);
// }

export default CastManager;