/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import { deleteFile } from "../../api/Storage/deleteFile.js";
import { createFile } from "../../api/Storage/createFile.js";

// Manages the list of records of a code cast
class RecordManager extends Observable {

    constructor() {
        super();
        this.data = [];
        this.playAllActive = false;
        this.index = 0;
        this.deletedFiles = [];
    }

    addRecord(record) {
        this.data.push(record);
        record.addEventListener("audio-end", event => { this.onRecordEnd(event); });
    }

    //stores the audio files with its IDs in the database and returns an array of the IDs
    async createDBRecord() {
        let files = await this.getRecords(),
            results = [],
            records = [];
        // Deleting all the files from records that did get deleted from the Cast, but still have files on the server
        for(let fileID of this.deletedFiles){
            await deleteFile(fileID);
        }
        files.forEach(async (file) => {
            deleteFile(file.name)
                .then(async () => await createFile(file.name, file))
                .catch(async () => await createFile(file.name, file));
            results.push(file.name);
        });
        for (let result of results) {
            records.push(JSON.stringify({
                id: result,
                title: this.data.filter(entry => entry.getID() === result)[0].getTitle(),
                time: this.data.filter(entry => entry.getID() === result)[0].getTime(),
            }));
        }
        return records;
    }

    // Stops the audio if it is playing and filters a element with certain id out of the record list
    deleteRecord(id) {
        let recordToDelete = this.data.filter(entry => entry.getID() === id)[0],
            deletedIndex = this.getIndexFromRecord(recordToDelete);
        if (this.data[this.index] !== null && this.data[this.index] !== undefined) {
            if (this.data[this.index].getID() === id) {
                this.data[this.index].stopAudio();
                if (this.playAllActive) {
                    this.playCast(this.index + 1);
                }
            }
        }
        this.data = this.data.filter(entry => entry.getID() !== id);
        if (this.index > deletedIndex) {
            this.index--;
        }
        // We keep track of the deleted file IDs so when the cast is safed (from an edit point of view)
        // we have to delete these files, because they would be staying on the DB Storage otherwise
        this.deletedFiles.push(id);
    }

    getIndexFromRecord(record) {
        return this.data.indexOf(record);
    }

    // Stops the currentRecord and filters a specific element and plays the certain audio file
    playRecord(id) {
        let record = this.data.filter(entry => entry.getID() === id)[0];
        if (this.data[this.index] !== null && this.data[this.index] !== undefined) {
            if (this.data[this.index].getID() !== id) {
                this.onAudioEnd(this.data[this.index]);
            }
        }
        this.onAudioPlayed(record);
        this.index = this.getIndexFromRecord(record);
        record.playAudio();
    }

    // Stops the currentRecord
    stopRecord(id) {
        let record = this.data.filter(entry => entry.getID() === id)[0];
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
        } else {
            this.onEndOfAutoplay();
        }
    }

    onEndOfAutoplay() {
        let event = new Event("cast-end", "cast play ended");
        this.notifyAll(event);
    }

    // Returns to the previous record and plays it
    onPreviousRecord() {
        if (this.data[this.index] !== undefined && this.data[this.index] !== null) {
            this.onAudioEnd(this.data[this.index]);
            if (this.index - 1 >= 0) {
                this.index--;
                this.data[this.index].playAudio();
                this.onAudioPlayed(this.data[this.index]);
            } else {
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
    // changes name of record
    onEntryTitleChanged(data) {
        let id = data.id,
            record = this.data.filter(entry => entry.getID() === id)[0],
            index = this.getIndexFromRecord(record);
        record.setTitle(data.title);
        this.data[index] = record;
    }

    // returns an array of the .ogg files in the cast
    async getRecords() {
        let files = [];
        for (let record of this.data) {
            let file = await record.getOggFile();
            files.push(file);
        }
        return files;
    }
}

export default RecordManager;