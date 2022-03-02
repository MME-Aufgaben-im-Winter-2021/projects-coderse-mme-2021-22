    import {Observable, Event} from "../../../utils/Observable.js";

    /* eslint-env browser */
    const TEMPLATE = document.getElementById('player-template').innerHTML
    .trim();

    // A single Entry for the Audio Player consisting of a time, a name and a audio file
    class PlayerEntry extends Observable {

    constructor(name, time) {
        super();
        this.view = this.createPlayerEntry();
        this.view.querySelector(".player-list-entry-title").innerHTML = name;
        this.view.querySelector(".player-list-entry-time").innerHTML = time;
        this.deleteIcon = this.view.querySelector(".player-list-entry-icon-delete");
        this.playIcon = this.view.querySelector(".player-list-entry-icon-play");
        this.deleteIcon.addEventListener("click", this.deleteEntry.bind(this));
        this.playIcon.addEventListener("click", this.play.bind(this));
    }

    // Creates a Entry by using the template from the html document
    createPlayerEntry() {
        let view = document.createElement("div");
        view.innerHTML = TEMPLATE;
        return view.firstChild;
    }

    // Plays the Audio of this Entry
    play() {
        console.log("AUDIO IS PLAYING");
        // Change Icon and play audio data
    }

    // Deletes the Entry
    deleteEntry() {
        // Notifies the player
        let event = new Event("entry-delete", this.view);
        this.notifyAll(event);
    }

    // Returns the node of this element -> For list operations
    getNode() {
        return this.view;
    }

    }

    export default PlayerEntry;