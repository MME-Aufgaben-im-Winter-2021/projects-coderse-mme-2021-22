/* eslint-env browser */

//Structure for one record in the file
class Record {

    constructor(title, time)
    {
        this.id = Date.now();
        this.title = title;
        this.time = time;
        this.audio = null;
    }

    // Plays the audio file linked to this record
    playAudio(){
        let audio = new Audio();
        audio.src = this.audio;
        audio.load();
        audio.onloadeddata = () => audio.play();
    }

    setAudio(audio){
        this.audio = audio;
    }

    getID(){
        return this.id;
    }

}

export default Record;