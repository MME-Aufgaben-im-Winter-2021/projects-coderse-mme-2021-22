/* eslint-env browser */
import { Observable, Event } from "../../../utils/Observable.js";
import PlayerEntry from "./PlayerEntryView.js";

// Class for the Audio Player in Code Cast Edit screen
class Player extends Observable {

    constructor() {
        super();
        // The list element from the html-doc
        this.list = document.querySelector(".player-list");
        this.timerInterval = null;
        this.entryViews = [];
    }

    // Add a Entry (A new Audio) to the list
    addEntry(record) {
        let entry = new PlayerEntry(record.id, record.title, record.time);
        entry.addEventListener("entry-delete", this.deleteEntry.bind(this));
        entry.addEventListener("entry-play", event => this.notifyAll(event));
        entry.addEventListener("mouse-over-player-entry", event => this.notifyAll(event));
        entry.addEventListener("mouse-out-player-entry", event => this.notifyAll(event));
        entry.addEventListener("entry-stop", event => this.notifyAll(event));
        entry.addEventListener("entry-title-changed", event => this.notifyAll(event));
        this.list.appendChild(entry.getNode());
        this.entryViews.push(entry);
    }

    //adds all records to the view
    showEntries(records) {
        if (!records.length === 0) {
            records.forEach(record => {
                this.addEntry(record);
            });
        }
    }

    // Delete a certain entry from the list with the event target
    // (Possible point which can be used with an Event on a Player Entry)
    deleteEntry(event) {
        let entry = event.data,
            ev = new Event("entry-delete", event);
        this.list.removeChild(entry);
        this.entryViews = this.entryViews.filter(entry => entry.getId() !== event.data.getAttribute("data-id"));
        // To inform the model about deleting an entry
        this.notifyAll(ev);
    }

    // Return list entry node by id
    getEntryById(id) {
        let res;
        this.entryViews.forEach(entry => {
            if (entry.getId() === id) {
                res = entry;
            }
        });
        return res;
    }

    // Marks a entry as played and starts the timer
    startPlayedEntry(event) {
        let entry = this.getEntryById(event.data.id);
        entry.showPlay();
    }

    // Removes the mark from a entry
    endPlayedEntry(event) {
        let entry = this.getEntryById(event.data.id);
        if (entry !== undefined && entry !== null) {
            entry.stopPlay();
        }
    }

    hasNoEntries() {
        return this.entryViews.length === 0;
    }

    onMouseOverMarking(event) {
        let id = event.data,
            entry = this.getEntryById(id);
        entry.showEntryHighlight();
    }

    onMouseOutMarking(event) {
        let id = event.data,
            entry = this.getEntryById(id);
        entry.deleteEntryHighlight();
    }

}

export default Player;