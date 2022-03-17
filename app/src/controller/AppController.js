/* eslint-env browser */
import Router from "../utils/Router.js";

// Controllers
import CastController from "./CastController.js";
import LoginController from "./LoginController.js";
import HomeController from "./HomeController.js";
import AccountController from "./AccountController.js";
import ErrorController from "./ErrorController.js";
import RegisterController from "./RegisterController.js";

import NavView from "../view/Navbar/NavView.js";

// Authentication
import { getAuth } from "../api/Auth/getAuth.js";

// Validating a shared cast
import { getDocument } from "../api/Collections/getDocument.js";

// Config which keeps important numbers;
import Config from "../utils/Config.js";

// Session deletion
import { deleteSession } from "../api/Session/deleteSession.js";
import { getUser } from "../api/User/getUser.js";

// The App Controller keeps track of the switches between certain parts of the application
// It uses a self build router, which keeps track of certain states
// To create a new page: - Create a html template in pages folder
//                       - create a route in Router.js for the new page
//                       - add a case in the below templateReady functions switch structure
// 
// If you want to work with login or registration comment the marked section in the computeCurrentPage function

class AppController {

    init() {
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

        // We only need one NavView, if we would do one in each controller it would cause problems
        this.navView = new NavView();
        this.navView.addEventListener("user-logout", this.onUserLogOutClicked.bind(this));
        this.navView.addEventListener("cast-safe", this.onSaveCastClicked.bind(this));
    }

    onSaveCastClicked(event) {
        this.controller.safeCast(event);
    }

    onUserLogOutClicked() {
        deleteSession().then(() => {
            this.setHash("login");
        });
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
            let logged = res.login;
            // user = res.user;

            this.computeCurrentPage(event, logged);

        });

    }

    // Recieves a template from the router and a hash identifier
    // Diminishes between certain cases, then inits the relevant parts
    async onTemplateReady(event) {
        let template = event.data,
            shareData;

        // After a template is set, we init a controller which takes care of the functionality
        switch (template.route) {
            case "#home":
                this.container.innerHTML = template.template;
                this.controller = new HomeController();
                this.controller.init(this.navView);
                this.controller.addEventListener("on-view", this.onViewCastClicked.bind(this));
                break;
            case "#login":
                this.container.innerHTML = template.template;
                this.controller = new LoginController();
                this.controller.init(this.navView);
                break;
            case "#create":
                this.container.innerHTML = template.template;
                this.controller = new CastController();
                this.controller.init(this.navView, await this.computeCreateID());
                break;
            case "#account":
                this.container.innerHTML = template.template;
                this.controller = new AccountController();
                this.controller.init(this.navView);
                break;
            case "#register":
                this.container.innerHTML = template.template;
                this.controller = new RegisterController();
                this.controller.init(this.navView);
                break;
            case "#/share/:id":
                shareData = await this.computeShareScreen();
                if (shareData !== false) {
                    this.container.innerHTML = template.template;
                    this.controller = new CastController();
                    this.controller.init(this.navView, shareData.answer.$id);
                    this.controller.addEventListener("content-load", this.controller.setShareScreen.bind(this
                        .controller, shareData.answer.userName));
                }
                break;
            default:
                this.container.innerHTML = template.template;
                this.controller = new ErrorController();
                this.controller.init(this.navView);
        }
    }

    // If a user is logged in, he does not want to visit the login page
    // This function is redirecting to "home" if so.
    computeCurrentPage(event, loggedIn) {
        let currentHash = window.location.hash;
        // If a user is logged in, he should not be able to view login and register page
        // FROM HERE
        // If a user starts the app
        if (currentHash === "") {
            this.setHash("login");
        }
        if (!this.router.isDynamicShareRoute(currentHash)) {
            if (loggedIn) {
                if (currentHash === "#login" || currentHash === "#register") {
                    this.setHash("home");
                }
            } else {
                if (currentHash !== "#login" && currentHash !== "#register") {
                    this.setHash("login");
                }
            }
        }
        // TO HERE
        this.router.onHashChanged(event);
    }

    // We have to check if the ID is actually valid
    // In order to be valid, an ID has to be Linked to a Cast in the DB
    async computeShareScreen() {
        let id = window.location.hash.substring(Config.URL_SUBSTRING_START),
            // If there is a document with the id of the url -> the cast will be displayed
            castExists = await getDocument(Config.CAST_COLLECTION_ID, id).then(res => {
                let data = {
                    state: true,
                    answer: res,
                };
                return data;
            }, () => {
                this.setHash("error/404");
                return false;
            });
        return castExists;
    }

    async computeCreateID() {
        let id = window.location.hash.substring(8),
            currentUser = await getUser(),
            currentUserID = currentUser.$id;
        // If the Cast is not from the current User -> redirect to home
        // Could be the case if a user tries to type in the id in the URl on his own
        await getDocument(Config.CAST_COLLECTION_ID ,id).then(res => {
            if(res.userID !== currentUserID){
                this.setHash("home");
            }
        });
        return id.length === 0 ? undefined : id;
    }

    onViewCastClicked(event) {
        this.setHash("#create/" + event.data);
    }
}
export default AppController;