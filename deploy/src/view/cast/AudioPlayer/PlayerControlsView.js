/* eslint-env browser */

import { Observable, Event } from "../../../utils/Observable.js";

// Captures clicks for playing the whole cast and navigation between records
class PlayerControlsView extends Observable {

    constructor() {
        super();
        this.view = document.querySelector(".player");
        this.playButton = this.view.querySelector(".player-icon-play");
        this.stopButton = this.view.querySelector(".player-icon-stop");
        this.previousButton = this.view.querySelector(".player-icon-backward");
        this.nextButton = this.view.querySelector(".player-icon-forward");
        this.playButton.addEventListener("click", this.playButtonClick.bind(this));
        this.stopButton.addEventListener("click", this.stopButtonClicked.bind(this));
        this.previousButton.addEventListener("click", this.previousButtonClick.bind(this));
        this.nextButton.addEventListener("click", this.nextButtonClick.bind(this));
    }

    playButtonClick() {
        this.showIconStop();
        this.hideIconPlay();
        let event = new Event("play-records", "");
        this.notifyAll(event);
    }

    stopButtonClicked() {
        let event = new Event("stop-records", "");
        this.notifyAll(event);
    }

    previousButtonClick() {
        let event = new Event("previous-record", "");
        this.notifyAll(event);
    }

    nextButtonClick() {
        let event = new Event("next-record", "");
        this.notifyAll(event);
    }

    showIconStop() {
        this.stopButton.classList.remove("hidden");
    }

    hideIconPlay() {
        this.playButton.classList.add("hidden");
    }

    resetIcons() {
        this.stopButton.classList.add("hidden");
        this.playButton.classList.remove("hidden");
    }

}

export default PlayerControlsView;