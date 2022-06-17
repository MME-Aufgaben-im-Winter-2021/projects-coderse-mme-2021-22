/* eslint-env browser */

import { Observable, Event } from "../../utils/Observable.js";
import Modal from "../utilViews/Modal.js";

class AccountView extends Observable {

    constructor() {
        super();
        this.viewUsername = document.getElementById("input-username");
        this.viewEmail = document.getElementById("input-email");
        this.viewPassword = document.getElementById("input-password");
        this.viewBtn = document.getElementById("input-btn");
        this.viewBtn.addEventListener("click", this.onSubmit.bind(this));
        this.errorText = document.querySelector("#server-answer");
        this.deleteBtn = document.getElementById("delete-btn");
        this.deleteBtn.addEventListener("click", this.onDelete.bind(this));
    }

    setUsername(username) {
        this.viewUsername.value = username;
    }

    setEmail(email) {
        this.viewEmail.value = email;
    }

    clearError() {
        this.errorText.innerHTML = "";
    }

    setError(errorMessage) {
        this.errorText.innerHTML = errorMessage;
    }

    clearPassword() {
        this.viewPassword.value = "";
    }

    onSubmit() {
        let data = {
            username: this.viewUsername.value,
            email: this.viewEmail.value,
            password: this.viewPassword.value,
        };
        this.notifyAll(new Event("account-submit", data));
    }

    onDelete() {
        let password = this.viewPassword.value;
        this.modal = new Modal("Are you sure you want to delete your CODERSE account?",
            "All your Codecasts will be lost ...", "Delete", "Decline");
        this.modal.addEventListener("onAcceptClicked", () => this.notifyAll(new Event("account-delete", password)));
    }

}

export default AccountView;