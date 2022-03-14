/* eslint-env browser */
import Router from "../utils/Router.js";

// Controllers
import CastController from "./CastController.js";
import LoginController from "./LoginController.js";
import HomeController from "./HomeController.js";
import AccountController from "./AccountController.js";
import ErrorController from "./ErrorController.js";
import RegisterController from "./RegisterController.js";

// Authentication
import { getAuth } from "../api/Auth/getAuth.js";

// The App Controller keeps track of the switches between certain parts of the application
// It uses a self build router, which keeps track of certain states
// To create a new page: - Create a html template in pages folder
//                       - create a route in Router.js for the new page
//                       - add a case in the below templateReady functions switch structure

class AppController {

    constructor() {
        this.router = new Router();
        window.addEventListener("hashchange", this.onHashChanged.bind(this));
        window.addEventListener("load", this.onHashChanged.bind(this));
        this.router.addEventListener("template-ready", this.onTemplateReady.bind(this));

        // Navbar links (This listener is used to push this page onto the stack)
        this.homeLink = document.querySelector("#home-link").addEventListener("click", this.router.pushRoute.bind(
            this.router));
        this.createLink = document.querySelector("#create-link").addEventListener("click", this.router.pushRoute
            .bind(this.router));
        this.userLink = document.querySelector("#user-link").addEventListener("click", this.router.pushRoute.bind(
            this.router));

        // The currently used templates and the controller which takes care of the functionality regarding the template
        this.container = document.querySelector(".content-container");
        this.controller = undefined;
    }

    setHash(hash) {
        window.location.hash = hash;
    }

    // When the user routes through the application, he has to be authenticated to use some pages
    // Thats why u have to look for current sessions before giving access
    onHashChanged(event) {
        getAuth().then(res => {
            // The case we have a good result
            // Now we have to test if a user is logged in or not
            let logged = res.login,
                user = res.user;

            this.computeCurrentPage(event, logged); //user is logged in

        }, (error) => {
            // TODO: What to do when there is an error?
            this.setHash("login");
            console.log("onHashChangedError", error);
        });

    }

    // Recieves a template from the router and a hash identifier
    // Diminishes between certain cases, then inits the relevant parts
    onTemplateReady(event) {
        let template = event.data;
        this.container.innerHTML = template.template;
        // After a template is set, we init a controller which takes care of the functionality
        switch (template.route) {
            case "#home":
                this.controller = new HomeController();
                this.controller.init();
                break;
            case "#login":
                this.controller = new LoginController();
                this.controller.init();
                break;
            case "#create":
                this.controller = new CastController();
                this.controller.init();
                break;
            case "#account":
                this.controller = new AccountController();
                this.controller.init();
                break;
            case "#register":
                this.controller = new RegisterController();
                this.controller.init();
                break;
            default:
                this.controller = new ErrorController();
                this.controller.init();
        }
    }

    // If a user is logged in, he does not want to visit the login page
    // This function is redirecting to "home" if so.
    computeCurrentPage(event, loggedIn) {
        let currentHash = window.location.hash;
        // If a user is logged in, he should not be able to view login and register page
        if (loggedIn) {
            if (currentHash === "#login" || currentHash === "#register") {
                this.setHash("home");
            }
        } else {
            if (currentHash !== "#login" && currentHash !== "#register") {
                this.setHash("login");
            }
        }
        this.router.onHashChanged(event);
    }

}
export default AppController;