/* eslint-env browser */

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

export default Modal;