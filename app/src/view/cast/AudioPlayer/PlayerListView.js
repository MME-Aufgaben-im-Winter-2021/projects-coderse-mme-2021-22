/* eslint-env browser */
import { Observable, Event } from "../../../utils/Observable.js";
import PlayerEntry from "./PlayerEntryView.js";

// Class for the Audio Player in Code Cast Edit screen
class Player extends Observable {

    constructor() {
        super();
        // The list element from the html-doc
        this.list = document.querySelector(".player-list");
        this.list.addEventListener("dragover", e => { e.preventDefault(); });
        document.addEventListener("drop", this.onDrop.bind(this));
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
        entry.addEventListener("drag", this.onDrag.bind(this));
        entry.addEventListener("drag-over", this.onDragOver.bind(this));
        this.list.appendChild(entry.getNode());
        this.entryViews.push(entry);
        this.currentDraggedId = null;
    }

    //adds all records to the view
    showEntries(records) {
        if (!records.length === 0) {
            records.forEach(record => {
                this.addEntry(record);
            });
        }
    }

    disableDragAndDrop(){
        this.entryViews.forEach(entry => {
            entry.disableDragAndDrop();
        });
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

    // Enables Drag and Drop in player-list
    onDrag(event) {
        this.currentDraggedId = event.data;
    }

    // Finds out where to put dragged element in player-list (either above or below) and drops it there
    onDragOver(event) {
        let allEntries = document.querySelectorAll(".player-list-entry"),
            droppedElement,
            fromAbove;
        if (event.data.placeId === this.currentDraggedId) {
            return;
        }
        allEntries.forEach(entryView => {
            if (entryView.getAttribute("data-id") === event.data.placeId) {
                fromAbove = true;
            }
            if (entryView.getAttribute("data-id") === this.currentDraggedId) {
                droppedElement = entryView;
                fromAbove = false;
            }
        });
        if (fromAbove) {
            let droppedPlace = this.getEntryById(event.data.placeId).view.nextSibling;
            if (droppedPlace === null) {
                this.list.appendChild(droppedElement);
            } else {
                this.list.insertBefore(droppedElement, droppedPlace);
            }
        } else {
            this.list.insertBefore(droppedElement, this.getEntryById(event.data.placeId).view);
        }
    }

    // Updates the order of the entry to be sent to database
    onDrop() {
        let recordIDs = [],
            e,
            allEntries = document.querySelectorAll(".player-list-entry");
        allEntries.forEach(entryView => {
            recordIDs.push(entryView.getAttribute("data-id"));
        });
        e = new Event("on-record-list-changed", recordIDs);
        this.notifyAll(e);
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
    // Highlights the proper entry while hovering over marked code
    onMouseOverMarking(event) {
        let id = event.data,
            entry = this.getEntryById(id);
        entry.showEntryHighlight();
    }
    // Removes the Highlight from proper entry while end hovering over marked code
    onMouseOutMarking(event) {
        let id = event.data,
            entry = this.getEntryById(id);
        entry.deleteEntryHighlight();
    }

    hideEditable() {
        for (const entry of this.entryViews) {
            entry.hideDeleteIcon();
            entry.hideTitleEdit();
        }
    }

}

export default Player;