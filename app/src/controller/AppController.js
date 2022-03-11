/* eslint-env browser */
import Router from "../utils/Router.js";

// Controllers
import CastController from "./castController.js";

// The App Controller keeps track of the switches between certain parts of the application
// It uses a self build router, which keeps track of certain states

class AppController {

    constructor(){
        this.router = new Router();
        window.addEventListener("hashchange", this.router.onHashChanged.bind(this.router));
        window.addEventListener("load", this.router.onHashChanged.bind(this.router));
        this.btn = document.querySelector(".home").addEventListener("click", this.router.pushRoute);
        this.router.addEventListener("template-ready", this.onTemplateReady.bind(this));

        // The currently used templates and the controller which takes care of the functionality regarding the template
        this.container = document.querySelector(".content-container");
        this.controller = undefined;
    }

    setHash(hash){
        window.location.hash = hash;
    }

    // Recieves a template from the router and a hash identifier
    // Diminishes between certain cases, then inits the relevant parts
    onTemplateReady(event){
        let template = event.data;
        console.log("TEMPLATE READY: ",template);
        this.container.innerHTML = template.template;
        switch(template.route){
            case "#home":
                
                break;
            case "#login":
                
                break;
            case "#create":
                this.controller = new CastController();
                this.controller.init();
                break;
            default:
                console.log(404);
        }
    }

}
export default AppController;