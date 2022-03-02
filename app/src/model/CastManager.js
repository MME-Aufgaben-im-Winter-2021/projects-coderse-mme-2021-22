/* eslint-env browser */
import AudioManager from "./AudioManager.js";
import Record from "./Record.js";
import {Event, Observable} from "../utils/Observable.js";

var audioManager;

// Cast Model managing the data
class CastManager extends Observable{

    constructor(){
        super();
        this.file = null;
        this.currentRecord = null;
        audioManager = new AudioManager();
        audioManager.addEventListener("audio-recorded", this.onAudioFileRecorded.bind(this));
    }

    //the current file for the codecast
    setFile(file)
    {
        this.file = file;
    }

    //starts the record in the audioManager
    startRecord(){
        audioManager.record();
    }

    //stops the record and stores title and time in a new Record object
    stopRecord(event){
        audioManager.stopRecord();
        this.currentRecord = new Record(event.data.title, event.data.time);
    }

    //adds Audio to the current Record object and informs the CastController
    onAudioFileRecorded(event)
    {
        this.currentRecord.setAudio(event.data);
        let ev = new Event("audio-recorded", this.currentRecord);
        this.notifyAll(ev);
    }

}

export default CastManager;