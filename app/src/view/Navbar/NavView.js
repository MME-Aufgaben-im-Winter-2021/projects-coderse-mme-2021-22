/* eslint-env browser */

import { Observable, Event } from "../../utils/Observable.js";

// View for the Navbar of the Cast Creation - Useful for routing and setting the cast title
class NavView extends Observable {

    constructor() {
        super();
        this.view = document.querySelector(".nav-bar");
        this.safeBtn = this.view.querySelector(".button-save");
        this.homeBtn = this.view.querySelector("#home-link");
        this.createBtn = this.view.querySelector("#create-link");
        this.userBtn = this.view.querySelector("#user-dropdown");
        this.castTitle = this.view.querySelector(".code-cast-title");
        this.userLogout = this.view.querySelector("#user-logout");

        // Eventlistener
        this.safeBtn.addEventListener("click", this.castSafe.bind(this));
        this.userBtn.addEventListener("click", this.toggleDropdown.bind(this));
        this.userLogout.addEventListener("click", this.onUserLogOutClicked.bind(this));
    }

    onUserLogOutClicked() {
        let event = new Event("user-logout", "user wants to log out"); //TODO: needs more data?
        this.notifyAll(event);
    }

    // Event which fires on Save-Button click to safe/end the Cast
    castSafe() {
        let title = this.castTitle.value,
            event = new Event("cast-safe", title);
        this.notifyAll(event);
    }

    toggleDropdown() {
        let dropdown = document.querySelector("#nav-dropdown");
        dropdown.classList.toggle("hidden");
    }

    hideDropDown() {
        let dropdown = document.querySelector("#nav-dropdown");
        dropdown.classList.add("hidden");
    }

    showLinks() {
        this.homeBtn.classList.remove("hidden");
        this.createBtn.classList.remove("hidden");
        this.userBtn.classList.remove("hidden");
    }

    showSafeBtn() {
        this.safeBtn.classList.remove("hidden");
    }

    showTitleInput() {
        this.castTitle.classList.remove("hidden");
    }

    hideLinks() {
        this.homeBtn.classList.add("hidden");
        this.createBtn.classList.add("hidden");
        this.userBtn.classList.add("hidden");
    }

    hideSafeBtn() {
        this.safeBtn.classList.add("hidden");
    }

    hideTitleInput() {
        this.castTitle.classList.add("hidden");
    }

    setHomeActive() {
        this.removeActive();
        this.homeBtn.classList.add("active-link");
    }

    setCreateActive() {
        this.removeActive();
        this.createBtn.classList.add("active-link");
    }

    setUserActive() {
        this.removeActive();
        this.userBtn.classList.add("active-link");
    }

    removeActive() {
        this.homeBtn.classList.remove("active-link");
        this.userBtn.classList.remove("active-link");
        this.createBtn.classList.remove("active-link");
    }
}

export default NavView;