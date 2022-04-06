/* eslint-env browser */
import { Observable, Event } from "../../utils/Observable.js";
import CastListView from "./CastListView.js";
import Modal from "../utilViews/Modal.js";

class HomeView extends Observable {

    constructor() {
        super();
        this.answerView = document.getElementById("server-answer");
        this.castListView = new CastListView();
        this.castListView.addEventListener("on-view", (event) => this.notifyAll(event));
        this.castListView.addEventListener("on-delete", (event) => this.showDeleteModal(event));
        // this.castListView.addEventListener("on-delete", (event) => this.notifyAll(event));
        this.createCastFAB = document.querySelector(".fab-create-cast");
        this.createCastFAB.addEventListener("click", this.onFABcreateCastClicked.bind(this));
        this.helpButton = document.querySelector(".fab-help");
        this.helpButton.addEventListener("click", () => {this.notifyAll(new Event("home-help-clicked"));});
    }

    showDeleteModal(event) {
        let id = event.data,
            title = document.querySelector("[data-id=\"" + id + "\"]").querySelector(".cast-title").innerHTML;
        this.modal = new Modal("Cast delete", "Do you really want to delete the Cast \"" + title + "\" ?",
            "Yes, delete", "No, decline");
        this.modal.addEventListener("onAcceptClicked", () => this.notifyAll(event));
    }

    onFABcreateCastClicked() {
        let ev = new Event("on-fab-clicked", "fab click");
        this.notifyAll(ev);
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

}

export default HomeView;