class Cast {

    constructor(title) {
        this.title = title;
        this.codeFileID = undefined;
        this.castServerID = undefined;
        this.records = [];
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    } 

    setCodeFileID(id){
        this.codeFileID = id;
    }

    setRecords(records){
        this.records = records;
    }

    getJSON(user) {
        return {
            title: this.title,
            userName: user.name,
            userID: user.$id,
            codeFileID: this.codeFileID,
            records: this.records,
        };
    }

}

export default Cast;