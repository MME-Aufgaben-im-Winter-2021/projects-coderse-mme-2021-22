/* eslint-env browser */

import {Observable, Event} from "../../utils/Observable.js";

class LoginView extends Observable {

    constructor(){
        super();
        this.viewEmail = document.getElementById("input-email");
        this.viewPassword = document.getElementById("input-password");
        this.viewBtn = document.getElementById("input-btn");
        this.viewBtn.addEventListener("click", this.onSubmit.bind(this));
    }

    // User wants to login
    onSubmit(){
        // Data as JSON Object stores email and password
        let data = {
                email: this.viewEmail.value,
                password: this.viewPassword.value,
        },
        // Data is send with an new login-submit event
        event = new Event("login-submit",data);
        this.notifyAll(event);
    }

}

export default LoginView;