/* eslint-env browser */

import { Observable, Event } from "../utils/Observable.js";

var mediaRecorder,
    inputStream;

// Model for computing audio files
class AudioManager extends Observable {

    constructor() {
        super();
        // The data object holds the current audio
        this.data = {};
    }

    // An input stream is opened to record an audio file
    record() {
        startInputStream(this);
    }

    // Input stream is stopped 
    stopRecord() {
        stopInputStream();
        mediaRecorder.stop();
    }

}

// Starts an input stream for an audio 
// Creates a file, when the audio is complete by listening to the media recorder 'ondataavailable' event
function startInputStream(self) {
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
    }).then(stream => {
        inputStream = stream;
        mediaRecorder = new MediaRecorder(inputStream);
        mediaRecorder.ondataavailable = event => {
            let file = URL.createObjectURL(event.data);
            onAudioFileRecorded(file, self);
            // window.open(file);
        };
        mediaRecorder.start();
    });
}

// Communicate the complete audio file with an event 
function onAudioFileRecorded(file, self) {
    console.log(file, self);
    self.data = file;
    let event = new Event("audio-recorded", file);
    self.notifyAll(event);
}

// Stops the input stream for audio
function stopInputStream() {
    inputStream.getTracks().forEach(track => track.stop());
}

export default AudioManager;