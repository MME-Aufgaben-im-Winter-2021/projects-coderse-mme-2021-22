/* eslint-env browser */
import { Observable, Event } from "../../utils/Observable.js";
import Modal from "../utilViews/Modal.js";

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView extends Observable {

    constructor(title, id, link) {
        super();
        this.view = this.createView();
        this.setTitle(title);
        this.copyLink = this.view.querySelector("#copy-icon");
        // this.viewCast = this.view.querySelector("#view-btn");
        this.deleteCast = this.view.querySelector("#delete-cast-btn");
        this.linkEl = this.view.querySelector("#copy-link");
        this.copyLink.addEventListener("click", this.onCopyLinkClicked.bind(this));
        this.deleteCast.addEventListener("click", this.onDeleteCast.bind(this));
        this.view.addEventListener("click", this.onViewCast.bind(this));
        this.setID(id);
        this.setLink(link);
    }

    //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#using_the_clipboard_api Abgerufen am 22.03.22
    onCopyLinkClicked() {
        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                let self = this;
                navigator.clipboard.writeText(this.linkEl.value).then(function() {
                    /* clipboard successfully set */
                    self.showSuccess();
                }, function() {
                    /* clipboard write failed */
                });
            } 
        }, () => {
            // Fallback version for clipboard copying, for browsers like firefox.
            // Even though exeCommand ist deprecated, it is important for cross browser functionality
            this.linkEl.select();
            document.execCommand("copy");
            this.showSuccess();
        });
    }

    showSuccess(){
        let modal = new Modal("Link successfully copied to clipboard!", "Go share it with someone!","",""),
                appearanceTime = 1000;
        modal.hideActionBtn();
        modal.setSuccessModal();
        setTimeout(() => {
            modal.remove();
        }, appearanceTime);
    }

    setTitle(title) {
        this.view.querySelector(".cast-title").innerText = title;
    }

    getTitleFromElement() {
        return this.view.querySelector(".cast-title").innerText;
    }

    setLink(link) {
        this.linkEl.value = link;
    }

    setID(id) {
        this.view.setAttribute("data-id", id);
    }

    getID() {
        return this.view.getAttribute("data-id");
    }

    onDeleteCast() {
        let event = new Event("on-delete", this.getID());
        this.notifyAll(event);
    }

    onViewCast(event) {
        if (event.target.classList.contains("cast-element") || event.target.classList.contains("cast-title")) {
            let ev = new Event("on-view", this.getID());
            this.notifyAll(ev);
        }
    }

    createView() {
        let element = document.createElement("div");
        element.innerHTML = TEMPLATE;
        return element.firstChild;
    }

    getView() {
        return this.view;
    }

}
export default CastListElementView;