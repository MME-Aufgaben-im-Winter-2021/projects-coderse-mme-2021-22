/* eslint-env browser */

import {Observable, Event} from "../../utils/Observable.js";

class RegisterView extends Observable {

    constructor(){
        super();
        this.viewEmail = document.getElementById("input-email");
        this.viewPassword = document.getElementById("input-password");
        this.viewUsername = document.getElementById("input-username");
        this.viewBtn = document.getElementById("input-btn");
        this.viewBtn.addEventListener("click", this.onSubmit.bind(this));
        this.answerView = document.getElementById("server-answer");
    }

    // User wants to create an account
    onSubmit(){
        // Data as JSON object stores email and password and the username
        let data = {
                email: this.viewEmail.value,
                password: this.viewPassword.value,
                username: this.viewUsername.value,
        },
        // Data is send with an new account-submit event
        event = new Event("account-submit",data);
        this.notifyAll(event);
    }

    setServerAnswer(string){
        this.answerView.innerText = string; 
    }

}

export default RegisterView;