/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";

// Manages the list of records of a code cast
class RecordManager extends Observable {

    constructor() {
        super();
        this.data = [];
        this.playAllActive = false;
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
        if (this.data[this.index] !== null && this.data[this.index] !== undefined) {
            if (this.data[this.index].getID() === parseInt(id)) {
                this.data[this.index].stopAudio();
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
        if (this.data[this.index] !== null && this.data[this.index] !== undefined) {
            if (this.data[this.index].getID() !== parseInt(id)) {
                this.onAudioEnd(this.data[this.index]);
            }
        }
        this.onAudioPlayed(record);
        this.index = this.getIndexFromRecord(record);
        record.playAudio();
    }

    // Stops the currentRecord
    stopRecord(id) {
        let record = this.data.filter(entry => entry.getID() === parseInt(id))[0];
        if (record !== null && record !== undefined) {
            this.onAudioEnd(record);
        }
        this.index = 0;
        this.playAllActive = false;
    }

    getAllRecords() {
        return this.data;
    }

    // Plays the cast from top to bottom
    // Set the id to start from another timeline entry
    playCast(index = 0) {
        if (this.data[this.index] !== null && this.data[this.index] !== undefined) {
            this.onAudioEnd(this.data[this.index]);
        }
        this.index = index;
        this.playAllActive = true;
        if (this.data[this.index] === undefined || this.data[this.index] === null) {
            this.playAllActive = false;
            this.onEndOfAutoplay();
            return;
        }
        this.data[this.index].playAudio();
        this.onAudioPlayed(this.data[this.index]);
    }

    // Stop the cast
    stopCast() {
        if (this.data[this.index]) {
            this.onAudioEnd(this.data[this.index]);
        }
        this.playAllActive = false;
        this.onEndOfAutoplay();
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
        else {
            this.onEndOfAutoplay();
        }
    }

    onEndOfAutoplay()
    {
        let event = new Event("cast-end", "cast play ended");
        this.notifyAll(event);
    }

    // Returns to the previous record and plays it
    onPreviousRecord() {
        if(this.data[this.index] !== undefined && this.data[this.index] !== null) {
            this.onAudioEnd(this.data[this.index]);
            if (this.index - 1 >= 0) {
                this.index--;
                this.data[this.index].playAudio();
                this.onAudioPlayed(this.data[this.index]);
            }
            else {
                this.onEndOfAutoplay();
            }
        }
    }

    //Stops the audio and informs the CastManager for changing the UI
    onAudioEnd(record) {
        record.stopAudio();
        let event = new Event("audio-end", record);
        this.notifyAll(event);
    }

    onEntryTitleChanged(data){
        let id = data.id,
            record = this.data.filter(entry => entry.getID() === parseInt(id))[0],
            index = this.getIndexFromRecord(record);
        record.setTitle(data.title);
        this.data[index] = record;
    }

}

export default RecordManager;