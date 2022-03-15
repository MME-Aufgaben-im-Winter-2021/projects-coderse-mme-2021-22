/* eslint-env browser */

import { Observable, Event } from "../../utils/Observable.js";

//Structure for one record in the file
class Record extends Observable {

    constructor(title, time) {
        super();
        this.id = crypto.randomUUID(); //Date.now();
        this.title = title;
        this.time = time;
        this.audioFile = null;
        this.currentAudio = null;
    }

    async getOggFile() {
        return new Promise(function(resolve, reject){
            let file = fetch(this.audioFile)
            .then(result => result.blob())
            .then(blob => {
                file = new File([blob], this.id, { type: "audio/ogg; codecs=opus" });
            })
            .catch(() => {
                reject();
            });
            resolve(file);
        });
    }

    // Plays the audio file linked to this record
    playAudio() {
        let audio = new Audio(),
            event = new Event("audio-play", this);
        audio.src = this.audioFile;
        audio.load();
        audio.onloadeddata = () => audio.play();
        audio.onended = () => onAudioEnd(this);
        this.notifyAll(event);
        this.currentAudio = audio;
    }

    // Stop the audio
    stopAudio() {
        if (this.isPlaying()) {
            this.currentAudio.pause();
        }
    }

    setAudio(audioFile) {
        this.audioFile = audioFile;
    }

    isPlaying() {
        if (this.currentAudio === null || this.currentAudio === undefined) {
            return false;
        }
        return !this.currentAudio.paused && !this.currentAudio.ended;
    }

    getID() {
        return this.id;
    }

    setTitle(title) {
        this.title = title;
    }
}

// Listens on the end of this audio when its played
function onAudioEnd(self) {
    let event = new Event("audio-end", self);
    self.notifyAll(event);
}

export default Record;