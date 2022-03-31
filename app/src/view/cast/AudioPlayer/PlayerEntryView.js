    import Config from "../../../utils/Config.js";
    import { Observable, Event } from "../../../utils/Observable.js";

    /* eslint-env browser */
    const TEMPLATE = document.getElementById("player-template").innerHTML
        .trim();

    // A single Entry for the Audio Player consisting of a time, a name and a audio file
    class PlayerEntry extends Observable {

        constructor(id, name, time) {
            super();
            this.id = id;
            this.view = this.createPlayerEntry();
            this.view.setAttribute("data-id", id);
            this.view.addEventListener("mouseover", this.onMouseOverView.bind(this));
            this.view.addEventListener("mouseout", this.onMouseOut.bind(this));
            this.title = this.view.querySelector(".player-list-entry-title");
            this.title.innerHTML = name;
            this.title.addEventListener("click", this.onTitleClicked.bind(this));
            this.inputTitle = this.view.querySelector(".player-list-entry-title-input");
            this.view.querySelector(".player-list-entry-time").innerHTML = time;
            this.deleteIcon = this.view.querySelector(".player-list-entry-icon-delete");
            this.playIcon = this.view.querySelector(".player-list-entry-icon-play");
            this.stopIcon = this.view.querySelector(".player-list-entry-icon-stop");
            this.deleteIcon.addEventListener("click", this.deleteEntry.bind(this));
            this.playIcon.addEventListener("click", this.play.bind(this));
            this.stopIcon.addEventListener("click", this.stop.bind(this));
            this.timerInterval = null;
            this.initDragAndDrop();
        }
        // Sets the possibility for Drag and Drop while initializing new entry
        initDragAndDrop() {
            this.view.setAttribute("draggable", true);
            this.view.addEventListener("dragstart", this.onDrag.bind(this));
            this.view.addEventListener("dragover", this.onDragOver.bind(this));
            this.view.addEventListener("dragend", this.onDragEnd.bind(this));
        }

        disableDragAndDrop(){
            this.view.setAttribute("draggable", false);
        }

        // Starts to drag entry
        onDrag(event) {
            event.dataTransfer.setData("text", this.view.getAttribute("data-id"));
            let e = new Event("drag", this.view.getAttribute("data-id"));
            this.notifyAll(e);
            this.view.classList.add("hide");
        }

        // Sets the drag over another entry
        onDragOver(event) {
            let droppedPlace = event.currentTarget,
                e = new Event("drag-over", {
                    id: this.view.getAttribute("data-id"),
                    placeId: droppedPlace.getAttribute("data-id"),
                });
            event.preventDefault();
            this.notifyAll(e);
        }
        // Ends the drag and sets entry on dropped place
        onDragEnd() {
            this.view.classList.remove("hide");
        }

        onMouseOverView() {
            let event = new Event("mouse-over-player-entry", this.id);
            this.notifyAll(event);
        }

        onMouseOut() {
            let event = new Event("mouse-out-player-entry", this.id);
            this.notifyAll(event);
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

        // Stops a played audio
        stop() {
            let event = new Event("entry-stop", this.view.getAttribute("data-id"));
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

        setTimeView(string) {
            this.view.querySelector(".player-list-entry-play-time").innerHTML = string;
        }

        getId() {
            return this.view.getAttribute("data-id");
        }

        // Adds mark to the played entry and the time the entry is played
        showPlay() {
            let audioLength,
                startTime = Date.now();
            this.view.classList.add("player-list-entry-mark");
            this.timerInterval = setInterval(() => {
                let currentTime = Date.now(),
                    formatter = new Intl.NumberFormat("de-DE", { minimumIntegerDigits: 2 }),
                    minutes,
                    seconds;
                audioLength = Math.floor((currentTime - startTime) / Config.MS_OF_SEC);
                minutes = formatter.format(Math.floor(audioLength / Config.SEC_OF_MIN));
                seconds = formatter.format(audioLength % Config.SEC_OF_MIN);
                audioLength = minutes + ":" + seconds;
                this.setTimeView(audioLength);
            }, Config.INTERVAL_REFRESH_RATE);
            this.playIcon.classList.add("hidden");
            this.stopIcon.classList.remove("hidden");
        }

        // Removes marks from this entry and stops timer 
        stopPlay() {
            this.view.classList.remove("player-list-entry-mark");
            clearInterval(this.timerInterval);
            this.setTimeView("00:00");
            this.playIcon.classList.remove("hidden");
            this.stopIcon.classList.add("hidden");
        }

        onTitleClicked() {
            this.inputTitle.classList.remove("hidden");
            this.title.classList.add("hidden");
            this.inputTitle.value = this.title.innerHTML;
            this.inputTitle.focus();
            this.inputTitle.addEventListener("blur", this.onChangeTitle.bind(this));
            this.inputTitle.addEventListener("keypress", event => {
                if (event.key === "Enter") {
                    this.onChangeTitle();
                }
            });
        }

        onChangeTitle() {
            let event,
                data;
            this.inputTitle.classList.add("hidden");
            this.title.classList.remove("hidden");
            if (this.inputTitle.value.length !== 0) {
                this.title.innerHTML = this.inputTitle.value;
            }
            data = {
                id: this.id,
                title: this.title.innerHTML,
            };
            event = new Event("entry-title-changed", data);
            this.notifyAll(event);
        }

        showEntryHighlight() {
            this.view.classList.add("player-list-entry-highlight");
        }

        deleteEntryHighlight() {
            this.view.classList.remove("player-list-entry-highlight");
        }

        hideDeleteIcon() {
            this.deleteIcon.classList.add("hidden");
        }

        hideTitleEdit() {
            let newTitle = document.createElement("div");
            newTitle.classList.add("player-list-entry-title-no-hover");
            newTitle.innerHTML = this.title.innerHTML;
            this.title.parentNode.insertBefore(newTitle, this.title);
            this.title.parentNode.removeChild(this.title);
        }

    }

    export default PlayerEntry;