/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";

// Manages the list of records of a code cast
class RecordManager extends Observable {

    constructor() {
        super();
        this.data = [];
        this.playAllActive = false;
        this.currentRecord = null;
        this.index = 0;
    }

    addRecord(record) {
        this.data.push(record);
        record.addEventListener("audio-end", event => { this.onRecordEnd(event); });
    }

    // Filters a element with certain id out of the record list
    deleteRecord(id) {
        this.data = this.data.filter(entry => entry.getID() !== parseInt(id));
    }

    getIndexFromRecord(record) {
        return this.data.indexOf(record);
    }

    // Filters a specific element and plays the certain audio file
    playRecord(id) {
        let record = this.data.filter(entry => entry.getID() === parseInt(id))[0];
        record.playAudio();
        this.onAudioPlayed(record);
        this.index = this.getIndexFromRecord(record);
    }

    getAllRecords() {
        return this.data;
    }

    // Plays the cast from top to bottom
    // Set the id to start from another timeline entry
    playCast(index = 0) {
        this.index = index;
        this.currentRecord = this.data[this.index];
        this.playAllActive = true;
        if (this.currentRecord === undefined) {
            this.playAllActive = false;
            return;
        }
        console.log(this.currentRecord, "curr");
        this.currentRecord.playAudio();
        this.onAudioPlayed(this.currentRecord);
    }

    onAudioPlayed(record) {
        let event = new Event("audio-start", record);
        this.notifyAll(event);
    }

    // Plays the next audio if playAllActive and informs the CastManager about the end of the record
    onRecordEnd(event) {
        if (this.playAllActive) {
            this.playCast(this.index + 1);
        }

        this.notifyAll(event);
    }

    // Skips to the next timeline entry and plays it
    onNextRecord() {
        this.onAudioEnd(this.data[this.index]);
        if (this.index + 1 < this.data.length) {
            this.index++;
            this.data[this.index].playAudio();
            // Event to tell UI that this element is done playing
            this.onAudioPlayed(this.data[this.index]);
        }
    }

    // Returns to the previous record and plays it
    onPreviousRecord() {
        this.onAudioEnd(this.data[this.index]);
        if (this.index - 1 >= 0) {
            this.index--;
            this.data[this.index].playAudio();
            this.onAudioPlayed(this.data[this.index]);
        }
    }

    //Stops the audio and informs the CastManager for changing the UI
    onAudioEnd(record) {
        record.stopAudio();
        let event = new Event("audio-end", record);
        this.notifyAll(event);
    }

}

export default RecordManager;