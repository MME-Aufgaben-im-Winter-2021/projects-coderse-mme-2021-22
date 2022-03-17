/* eslint-env browser */

import { getDocument } from "../../api/Collections/getDocument.js";
import { listDocuments } from "../../api/Collections/listDocuments.js";
import { deleteFile } from "../../api/Storage/deleteFile.js";
import { deleteDocument } from "../../api/Collections/deleteDocument.js";

import Config from "../../utils/Config.js";

import {Observable, Event} from "../../utils/Observable.js";

class HomeManager extends Observable {

    constructor(){
        super();
    }

    // Creates Cast ELements for every Cast in the Collection
    async getCasts(){
        // Listing all the documents in the Cast collection
        let res = await listDocuments(Config.CAST_COLLECTION_ID),
            event = new Event("casts-retrieved", res);
        this.notifyAll(event);
    }

    // Deletes every file and document which belongs to a cast
    async deleteCast(castID){
        let cast = await getDocument(Config.CAST_COLLECTION_ID, castID),
            codeFileID = cast.codeFileID,
            records = cast.records;
        await deleteFile(codeFileID);
        for(let record of records){
            let json= JSON.parse(record);
            await deleteFile(json.id);
        }
        await deleteDocument(Config.CAST_COLLECTION_ID ,castID);

    }

}

export default HomeManager;