/* eslint-env browser */
import AudioManager from "./AudioManager.js";
import RecordManager from "./RecordManager.js";
import Record from "./Record.js";
import { Event, Observable } from "../utils/Observable.js";

var audioManager,
    recordManager;

// Cast Model managing the data
class CastManager extends Observable {

    constructor() {
        super();
        this.file = null;
        this.title = "";
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
        // audioManager.stopRecord(); TODO:
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
        console.log(event.data);
        this.currentRecord.setAudio(event.data);
        let ev = new Event("audio-recorded", this.currentRecord);
        this.notifyAll(ev);
    }

    // Plays the whole cast
    playCast() {
        recordManager.playCast();
    }

    stopCast(){
        recordManager.stopCast();
    }

    // Returns all the data from the current cast -> So it can be stored
    getCast() {
        return createCast(this);
    }

    onNextRecord() {
        recordManager.onNextRecord();
    }

    onPreviousRecord() {
        recordManager.onPreviousRecord();
    }

    onEntryTitleChanged(data){
        recordManager.onEntryTitleChanged(data);
    }
        
}

// Creates JSON with data from the current cast
function createCast(self) {
    let data = {
        id: Date.now(),
        title: self.title,
        file: self.file,
        records: recordManager.getAllRecords(),
    };
    return data;
}

export default CastManager;