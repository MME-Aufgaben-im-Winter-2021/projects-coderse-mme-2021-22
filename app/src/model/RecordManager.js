/* eslint-env browser */

// Manages the list of records of a code cast
class RecordManager {

    constructor(){
        this.data = [];
    }

    addRecord(record){
        this.data.push(record);
    }

    // Filters a element with certain id out of the record list
    deleteRecord(id){
        this.data = this.data.filter(entry => entry.getID() !== parseInt(id));
    }

    // Filters a specific element and plays the certain audio file
    playRecord(id){
        let record = this.data.filter(entry => entry.getID() === parseInt(id))[0];
        record.playAudio();
    }

    getAllRecords(){
        return this.data;
    }

}

export default RecordManager;