/* eslint-env browser */
import Router from "../utils/Router.js";

// Controllers
import CastController from "./CastController.js";
import LoginController from "./LoginController.js";
import HomeController from "./HomeController.js";
import AccountController from "./AccountController.js";
import ErrorController from "./ErrorController.js";

// Authentication
import { getAuth } from "../api/Auth/getAuth.js";

// The App Controller keeps track of the switches between certain parts of the application
// It uses a self build router, which keeps track of certain states

class AppController {

    constructor(){
        this.router = new Router();
        window.addEventListener("hashchange", this.onHashChanged.bind(this));
        window.addEventListener("load", this.onHashChanged.bind(this));
        this.router.addEventListener("template-ready", this.onTemplateReady.bind(this));

        // Navbar links (This listener is used to push this page onto the stack)
        this.homeLink = document.querySelector("#home-link").addEventListener("click", this.router.pushRoute.bind(this.router));
        this.createLink = document.querySelector("#create-link").addEventListener("click", this.router.pushRoute.bind(this.router));
        this.userLink = document.querySelector("#user-link").addEventListener("click", this.router.pushRoute.bind(this.router));
        
        // The currently used templates and the controller which takes care of the functionality regarding the template
        this.container = document.querySelector(".content-container");
        this.controller = undefined;
    }

    setHash(hash){
        window.location.hash = hash;
    }

    // When the user routes through the application, he has to be authenticated to use some pages
    // Thats why u have to look for current sessions before giving access
    onHashChanged(event){
        getAuth().then(res => {
            // The case we have a good result
            // Now we have to test if a user is logged in or not
            let logged = res.login,
                user = res.user;

            // If there is no user logged in -> redirect to the login page
            if(!logged){
                this.setHash("login");
            } 

            this.computeCurrentPage(event);
        }, () => {
            // TODO: What to do when there is an error?
            this.setHash("login");
        });
        
    }

    // Recieves a template from the router and a hash identifier
    // Diminishes between certain cases, then inits the relevant parts
    onTemplateReady(event){
        let template = event.data;
        this.container.innerHTML = template.template;
        // After a template is set, we init a controller which takes care of the functionality
        switch(template.route){
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
            default:
                this.controller = new ErrorController();
                this.controller.init();
        }
    }

    // If a user is logged in, he does not want to visit the login page
    // This function is redirecting to "home" if so.
    computeCurrentPage(event){
        let currentHash = window.location.hash;
        if(currentHash === "#login"){
             this.setHash("home");
        }
        this.router.onHashChanged(event);
    }

}
export default AppController;