/* eslint-env browser */

import { Observable, Event } from "../../utils/Observable.js";

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

    mediaRecorderIsRecording() {
        return mediaRecorder.state === "recording";
    }
}

// Starts an input stream for an audio 
// Creates a file, when the audio is complete by listening to the media recorder 'ondataavailable' event
function startInputStream(self) {
    var chunks = [];
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
    }).then(stream => {
        inputStream = stream;
        mediaRecorder = new MediaRecorder(inputStream);
        mediaRecorder.onstop = () => {
            var blob = new Blob(chunks, { "type": "audio/ogg; codecs=opus" }),
                audioURL = window.URL.createObjectURL(blob);
            // console.log(blob, audioURL);
            onAudioFileRecorded(audioURL, self);
        };
        mediaRecorder.ondataavailable = event => {
            // let file = URL.createObjectURL(event.data);
            chunks.push(event.data);
            // onAudioFileRecorded(event.data, self);
        };
        mediaRecorder.start();
    });
}

// Communicate the complete audio file with an event 
function onAudioFileRecorded(file, self) {
    self.data = file;
    let event = new Event("audio-recorded", file);
    self.notifyAll(event);
}

// Stops the input stream for audio
function stopInputStream() {
    inputStream.getTracks().forEach(track => track.stop());
}

export default AudioManager;