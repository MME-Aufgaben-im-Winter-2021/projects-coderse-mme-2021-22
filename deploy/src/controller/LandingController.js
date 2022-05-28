/* eslint-env browser */

import { Observable, Event } from "../utils/Observable.js";

class LandingController extends Observable {

    init(navView) {
        this.navView = navView;
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.hideNavView();

        this.loginBtn = document.querySelector(".lan-btn-login");
        this.loginBtn.addEventListener("click", this.notifyAll.bind(this, new Event("on-login-clicked", "login")));

        this.signUpBtn = document.querySelector(".lan-btn-sign-up");
        this.signUpBtn.addEventListener("click", this.notifyAll.bind(this, new Event("on-sign-up-clicked",
            "register")));

        this.scndBtn = document.querySelector(".lan-scnd-btn");
        this.scndBtn.addEventListener("click", this.notifyAll.bind(this, new Event("on-sign-up-clicked",
            "register")));
    }
}

export default LandingController;