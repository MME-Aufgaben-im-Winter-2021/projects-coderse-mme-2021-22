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

    // Stops the audio if it is playing and filters a element with certain id out of the record list
    deleteRecord(id) {
        let recordToDelete = this.data.filter(entry => entry.getID() === parseInt(id))[0],
            deletedIndex = this.getIndexFromRecord(recordToDelete);
        if (this.currentRecord !== null && this.currentRecord !== undefined) {
            if (this.currentRecord.getID() === parseInt(id)) {
                console.log("Stop Audio");
                this.currentRecord.stopAudio();
                if (this.playAllActive) {
                    this.playCast(this.index + 1);
                }
            }
        }
        this.data = this.data.filter(entry => entry.getID() !== parseInt(id));
        if (this.index > deletedIndex) {
            this.index--;
        }
    }

    getIndexFromRecord(record) {
        return this.data.indexOf(record);
    }

    // Stops the currentRecord and filters a specific element and plays the certain audio file
    playRecord(id) {
        let record = this.data.filter(entry => entry.getID() === parseInt(id))[0];
        if (this.currentRecord !== null && this.currentRecord !== undefined) {
            if (this.currentRecord.getID() !== parseInt(id)) {
                this.onAudioEnd(this.currentRecord);
            }
        }
        this.onAudioPlayed(record);
        this.index = this.getIndexFromRecord(record);
        this.currentRecord = record;
        this.currentRecord.playAudio();
    }

    // Stops the currentRecord
    stopRecord(id) {
        let record = this.data.filter(entry => entry.getID() === parseInt(id))[0];
        if (record !== null && record !== undefined) {
            this.onAudioEnd(record);
        }
        this.index = 0;
        this.currentRecord = null;
    }

    getAllRecords() {
        return this.data;
    }

    // Plays the cast from top to bottom
    // Set the id to start from another timeline entry
    playCast(index = 0) {
        if (this.currentRecord !== null && this.currentRecord !== undefined) {
            this.onAudioEnd(this.currentRecord);
        }
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

    //stop the cast
    stopCast() {
        console.log(this.currentRecord);
        if (this.currentRecord) {
            console.trace();
            this.onAudioEnd(this.currentRecord);
        }
        this.playAllActive = false;
        let event = new Event("cast-end", "cast play ended");
        this.notifyAll(event);
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
        if (this.playAllActive) {
            this.onAudioEnd(this.data[this.index]);
            if (this.index + 1 < this.data.length) {
                this.index++;
                this.data[this.index].playAudio();
                // Event to tell UI that this element is done playing
                this.onAudioPlayed(this.data[this.index]);
            }
        }
    }

    // Returns to the previous record and plays it
    onPreviousRecord() {
        if (this.playAllActive) {
            this.onAudioEnd(this.data[this.index]);
            if (this.index - 1 >= 0) {
                this.index--;
                this.data[this.index].playAudio();
                this.onAudioPlayed(this.data[this.index]);
            }
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