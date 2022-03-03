/* eslint-env browser */
import {Observable, Event} from '../../../utils/Observable.js';
import PlayerEntry from './PlayerEntryView.js';

// Class for the Audio Player in Code Cast Edit screen
class Player extends Observable {

    constructor() {
        super();
        // The list element from the html-doc
        this.list = document.querySelector(".player-list");
    }

    // Add a Entry (A new Audio) to the list
    addEntry(record) {
        let entry = new PlayerEntry(record.id, record.title, record.time);
        entry.addEventListener("entry-delete", this.deleteEntry.bind(this));
        entry.addEventListener("entry-play", event => this.notifyAll(event));
        this.list.appendChild(entry.getNode());
    }

    // Delete a certain entry from the list with the event target
    // (Possible point which can be used with an Event on a Player Entry)
    deleteEntry(event) {
        let entry = event.data,
            ev = new Event("entry-delete", event);
        this.list.removeChild(entry);
        // To inform the model about deleting an entry
        this.notifyAll(ev);
    }

}

export default Player;