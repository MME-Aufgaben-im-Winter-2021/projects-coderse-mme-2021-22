/* eslint-env browser */
/* eslint-disable */ //TODO: only here because missing invokeApplixirVideoUnit(options); import
import { Observable, Event } from "../../utils/Observable.js";
import CastListView from "./CastListView.js";
import Modal, { generateAdModal } from "../utilViews/Modal.js";
import AdController from "../../adSystem/AdController.js";

var self;

class HomeView extends Observable {

    constructor() {
        super();
        this.answerView = document.getElementById("server-answer");
        this.castListView = new CastListView();
        this.castListView.addEventListener("on-view", (event) => this.notifyAll(event));
        this.castListView.addEventListener("on-delete", (event) => this.showDeleteModal(event));
        this.createCastFAB = document.querySelector(".fab-create-cast");

        this.helpButton = document.querySelector(".fab-help");
        this.helpButton.addEventListener("click", () => { this.notifyAll(new Event("home-help-clicked")); });
    }

    showDeleteModal(event) {
        let id = event.data,
            title = document.querySelector("[data-id=\"" + id + "\"]").querySelector(".cast-title").innerHTML;
        this.modal = new Modal("Cast delete", "Do you really want to delete the Cast \"" + title + "\" ?",
            "Yes, delete", "No, decline");
        this.modal.addEventListener("onAcceptClicked", () => this.notifyAll(event));
    }

    setServerAnswer(string) {
        this.answerView.innerText = string;
    }

    addElement(title, id, link) {
        this.castListView.addElement(title, id, link);
    }

    clearList() {
        this.castListView.clear();
    }

    setNumOfCasts(numberOfShownCasts = 0) {
        this.numberOfShownCasts = numberOfShownCasts;
        if (this.numberOfShownCasts > 2) {
            this.adController = new AdController(".fab-create-cast");
        } else if (this.numberOfShownCasts == 2) {
            this.createCastFAB.addEventListener("click", generateAdModal);
        } else {
            this.createCastFAB.addEventListener("click", () => {
                this.notifyAll(new Event("ad-status",
                    "ad-successfull"));
            });
        }
    }

}

export default HomeView;