/* eslint-env browser */

import { Observable, Event } from "../../utils/Observable.js";

class AccountView extends Observable {

    constructor() {
        super();
        this.viewUsername = document.getElementById("input-username");
        this.viewEmail = document.getElementById("input-email");
        this.viewPassword = document.getElementById("input-password");
        this.viewBtn = document.getElementById("input-btn");
        this.viewBtn.addEventListener("click", this.onSubmit.bind(this));
        this.errorText = document.querySelector("#server-answer");
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

}

export default AccountView;