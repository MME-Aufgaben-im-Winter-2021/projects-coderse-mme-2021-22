/* eslint-env browser */

import { listDocuments } from "../../api/Collections/listDocuments.js";

import Config from "../../utils/Config.js";

import {Observable, Event} from "../../utils/Observable.js";

class HomeManager extends Observable {

    constructor(){
        super();
    }

    // TODO: Only retrieve this users casts
    // Creates Cast ELements for every Cast in the Collection
    async getCasts(){
        // Listing all the documents in the Cast collection
        let res = await listDocuments(Config.CAST_COLLECTION_ID),
            event = new Event("casts-retrieved", res);
        this.notifyAll(event);
    }

}

export default HomeManager;