    import {Observable, Event} from "../../../utils/Observable.js";

    /* eslint-env browser */
    const TEMPLATE = document.getElementById('player-template').innerHTML
    .trim();

    // A single Entry for the Audio Player consisting of a time, a name and a audio file
    class PlayerEntry extends Observable {

        constructor(id, name, time) {
            super();
            this.view = this.createPlayerEntry();
            this.view.setAttribute("data-id", id);
            this.view.querySelector(".player-list-entry-title").innerHTML = name;
            this.view.querySelector(".player-list-entry-time").innerHTML = time;
            this.deleteIcon = this.view.querySelector(".player-list-entry-icon-delete");
            this.playIcon = this.view.querySelector(".player-list-entry-icon-play");
            this.deleteIcon.addEventListener("click", this.deleteEntry.bind(this));
            this.playIcon.addEventListener("click", this.play.bind(this));
            this.timerInterval = null;
        }

        // Creates a Entry by using the template from the html document
        createPlayerEntry() {
            let view = document.createElement("div");
            view.innerHTML = TEMPLATE;
            return view.firstChild;
        }

        // Plays the Audio of this Entry
        play() {
            let event = new Event("entry-play", this.view.getAttribute("data-id"));
            this.notifyAll(event);
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

        setTimeView(string){
            this.view.querySelector(".player-list-entry-play-time").innerHTML = string;
        }
        
        getId(){
            return this.view.getAttribute("data-id");
        }

        // Adds mark to the played entry and the time the entry is played
        showPlay(){
            let audioLength,
                startTime = Date.now();
            this.view.classList.add("player-list-entry-mark");
            this.timerInterval = setInterval(()=>{
                let currentTime = Date.now(),
                    formatter = new Intl.NumberFormat('de-DE', { minimumIntegerDigits: 2 }),
                    minutes,
                    seconds;
                audioLength = Math.floor((currentTime - startTime) /1000);
                minutes = formatter.format(Math.floor(audioLength/60));
                seconds = formatter.format(audioLength % 60);
                audioLength = minutes + ":" + seconds;
                this.setTimeView(audioLength);
            },1000);
        }

        // Removes marks from this entry and stops timer 
        stopPlay(){
            this.view.classList.remove("player-list-entry-mark");
            clearInterval(this.timerInterval);
            this.setTimeView("00:00");
        }

    }

    export default PlayerEntry;