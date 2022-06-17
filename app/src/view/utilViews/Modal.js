/* eslint-env browser */

import AdController from "../../adSystem/AdController.js";
import { Observable, Event } from "../../utils/Observable.js";

const TEMPLATE = document.getElementById("modal").innerHTML.trim();

class Modal extends Observable {

    constructor(title, content, acceptBtnText, declineBtnText) {
        super();
        this.modal = createModal();
        fillModal(this.modal, title, content, acceptBtnText, declineBtnText);
        this.acceptBtnEl = this.modal.querySelector(".modal-btn-accept");
        this.declineBtnEl = this.modal.querySelector(".modal-btn-decline");
        this.acceptBtnEl.addEventListener("click", () => onButtonClicked.call(this, true));
        this.declineBtnEl.addEventListener("click", () => onButtonClicked.call(this, false));
        showModal(this.modal);
    }

    hideActionBtn() {
        this.acceptBtnEl.classList.add("hidden");
        this.declineBtnEl.classList.add("hidden");
    }

    setSuccessModal() {
        this.modal.querySelector("#modal-warning-img").classList.add("hidden");
        this.modal.querySelector("#modal-success-img").classList.remove("hidden");
        this.modal.querySelector(".modal-title").classList.add("modal-success-title");
    }

    setInfoModal() {
        this.modal.querySelector("#modal-warning-img").classList.add("hidden");
        this.modal.querySelector("#modal-info-img").classList.remove("hidden");
        this.modal.querySelector(".modal-title").classList.add("modal-info-title");
        this.declineBtnEl.classList.add("invisible");
    }

    setIntroModal() {
        this.setInfoModal();
    }

    remove() {
        removeModal(this.modal);
    }
}

function onButtonClicked(isAccept) {
    removeModal(this.modal);
    if (isAccept) {
        this.notifyAll(new Event("onAcceptClicked", "acceptBtn"));
    } else {
        this.notifyAll(new Event("onDeclineClicked", "declineBtn"));
    }
}

function showModal(modal) {
    document.querySelector("body").appendChild(modal);
}

function removeModal(modal) {
    document.querySelector("body").removeChild(modal);
}

function fillModal(modal, title, content, acceptBtnText, declineBtnText) {
    let titleEl = modal.querySelector(".modal-title"),
        contentEl = modal.querySelector(".modal-content"),
        acceptBtnEl = modal.querySelector(".modal-btn-accept"),
        declineBtnEl = modal.querySelector(".modal-btn-decline");
    titleEl.innerHTML = title;
    contentEl.innerHTML = content;
    acceptBtnEl.innerHTML = acceptBtnText;
    declineBtnEl.innerHTML = declineBtnText;
}

// Creates a dummy modal by using the template from the html document
function createModal() {
    let view = document.createElement("div");
    view.innerHTML = TEMPLATE;
    return view.firstChild;
}

function generateAdModal() {
    let adModal = new Modal(
            "Short ad before we start...",
            "Help us finance our start-up project by watching this ad.<br> Thank you for your support! 😊",
            "Start ad", ""),
        adController = new AdController(".modal-btn-accept");
    adModal.setInfoModal();
    adController.addEventListener("ad-error-modal-hidden", generateAdModal.bind(this));
}

function generateIntroModal(title, content) {
    let introModal = new Modal(
        title,
        content,
        "Got it!", "");
    introModal.setIntroModal();
}

export default Modal;
export { generateAdModal, generateIntroModal };