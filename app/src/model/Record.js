/* eslint-env browser */

//Structure for one record in the file
class Record {

    constructor(title, time)
    {
        this.title = title;
        this.time = time;
        this.audio = null;
    }

    setAudio(audio){
        this.audio = audio;
    }

}

export default Record;