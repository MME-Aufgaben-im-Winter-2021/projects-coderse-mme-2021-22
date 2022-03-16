/* eslint-env browser */
import AudioManager from "./AudioManager.js";
import RecordManager from "./RecordManager.js";
import Record from "./Record.js";
import { Event, Observable } from "../../utils/Observable.js";
import { getUser } from "../../api/User/getUser.js";
import { listDocuments } from "../../api/Collections/listDocuments.js";
import { updateDocument } from "../../api/Collections/updateDocument.js";
import { createDocument } from "../../api/Collections/createDocument.js";
import { getDocument } from "../../api/Collections/getDocument.js";
import { deleteFile } from "../../api/Storage/deleteFile.js";
import { createFile } from "../../api/Storage/createFile.js";
import { getFile } from "../../api/Storage/getFile.js";
import Config from "../../utils/Config.js";

var audioManager,
    recordManager;

// Cast Model managing the data
class CastManager extends Observable {

    constructor() {
        super();
        this.castServerID =
            undefined;
        this.codeFileID =
            undefined;

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

    //starts the record in the audioManager
    startRecord() {
        audioManager.record();
    }

    //stops the record and stores title and time in a new Record object
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
            fetch(codeFile.href).then(res => res.blob()).then(blob =>{
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

// Creates JSON with data from the current cast
//TODO: needs AudioIDs (serverIDs)
//TODO: needs CodeFileID (serverID)
async function saveCast(title, codeHTML, self) {
    let user = await getUser(),
        allCasts = await listDocuments(Config.CAST_COLLECTION_ID),
        castDocumentJSON,
        records,
        userID = user.$id,
        doesCastExistInCloud;
    if (self.castServerID) {
        allCasts.documents.forEach(castDoc => {
            if (castDoc.$id === self.castServerID) {
                doesCastExistInCloud = true;
            }
        });
    } else {
        doesCastExistInCloud = false;
    }
    if (self.codeFileID) {
        //delete -> to "update"
        await deleteFile(self.codeFileID);
    } else {
        self.codeFileID = crypto.randomUUID().substring(14) + "_code.txt";
    }
    await saveCodeAsFileToServer(codeHTML, self);

    records = await recordManager.createDBRecord();
    castDocumentJSON = {
        title: title,
        userID: userID,
        codeFileID: self.codeFileID,
        records: records,
    };

    if (doesCastExistInCloud) { //if the cast was already once saved in the cloud then update and don't create a new one
        await updateDocument(Config.CAST_COLLECTION_ID, self.castServerID, castDocumentJSON);
    } else { //create a new castDocument on the server
        await createDocument(Config.CAST_COLLECTION_ID, castDocumentJSON);
    }
}

//https://redstapler.co/generate-text-file-javascript/ Abgerufen am 15.03.22
async function saveCodeAsFileToServer(codeHTML, self) {
    let blob = new Blob([codeHTML], { type: "text/plain;charset=utf-8" }),
        file = new File([blob], self.codeFileID, { type: "text/plain;charset=utf-8" });
    await createFile(self.codeFileID, file);
}

export default CastManager;