/* eslint-env browser */
/* eslint-disable */ //TODO: only here because missing invokeApplixirVideoUnit(options); import
import { Observable, Event } from "../../utils/Observable.js";
import CastListView from "./CastListView.js";
import Modal from "../utilViews/Modal.js";

var self;

class HomeView extends Observable {

    constructor() {
        super();
        this.answerView = document.getElementById("server-answer");
        this.castListView = new CastListView();
        this.castListView.addEventListener("on-view", (event) => this.notifyAll(event));
        this.castListView.addEventListener("on-delete", (event) => this.showDeleteModal(event));
        this.createCastFAB = document.querySelector(".fab-create-cast");
        this.adBlur = document.querySelector(".ad-background-blur");
        self = this;

        function adStatusCallback(status) { // Status Callback Method
            let ev = new Event("ad-status", status);
            if (status == "ad-started" || status === "fb-started") {
                self.adBlur.classList.remove("hidden");
            } else {
                self.adBlur.classList.add("hidden");
            }
            self.notifyAll(ev);
        }

        //var userId = await getUser().$id;
        const options = { // Video Ad Options
            zoneId: 2050, // Required field for RMS
            accountId: 6773, // Required field for RMS                                                                               
            gameId: 7249, // Required field for RMS
            adStatusCb: adStatusCallback,
            endMsg: 1,
            //userId: userId,                      
        };

        let playBtn = document.querySelector(".fab-create-cast");
        playBtn.onclick = function() {
            invokeApplixirVideoUnit(options); // Invoke Video ad
        };


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

}

export default HomeView;