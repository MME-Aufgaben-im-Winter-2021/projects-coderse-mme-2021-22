/* eslint-env browser */

import {Observable, Event} from "../../../utils/Observable.js";

// View for the Navbar of the Cast Creation - Useful for routing and setting the cast title
class NavView extends Observable {

    constructor(){
        super();
        this.view = document.querySelector(".nav-bar");
        this.safeBtn = this.view.querySelector(".button-save");
        this.homeBtn = this.view.querySelector(".home");
        this.userBtn = this.view.querySelector(".user");
        this.castTitle = this.view.querySelector(".code-cast-title");

        // Eventlistener
        this.safeBtn.addEventListener("click", this.castSafe.bind(this));
        this.homeBtn.addEventListener("click", this.switchHome.bind(this));
        this.userBtn.addEventListener("click", this.switchUser.bind(this));
    }

    // Event which fires on Save-Button click to safe/end the Cast
    castSafe(){
        let title = this.castTitle.value,
            event = new Event("cast-safe", title);
        this.notifyAll(event);
    }

    switchUser(){
        console.log("YOU ARE NOW ON THE USER PAGE");
    }

    switchHome(){
        console.log("YOU ARE NOW ON THE HOME PAGE");
    }
}

export default NavView;