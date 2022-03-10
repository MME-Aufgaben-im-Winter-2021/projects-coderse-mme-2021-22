/* eslint-env browser */

import {Observable, Event} from "./Observable.js";

const ROUTES = {
    404: "./src/pages/404.html",
    "#create": "./src/pages/createCast.html",
    "#home": "./src/pages/home.html",
    "#login": "./src/pages/login.html",
};

// Router Class to navigate between pages with templates
class Router extends Observable {

    constructor(currentRoute = "/#login"){
        super();
        this.currentRoute = currentRoute;
    }

    pushRoute(event){
        event.preventDefault();
        let url = event.target.href;
        history.pushState(null,null,url);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }

    onHashChanged(){
        const hash = window.location.hash, 
              route = ROUTES[hash] || ROUTES[404];
        fetch(route).then(res => {
            let data = res.text();
            data.then(res => {
                let template = {
                    route: hash,
                    template: res,
                },
                    event = new Event("template-ready", template);
                this.notifyAll(event);
            });
        });
        console.log("Fetching ", route);    
    }
}

export default Router;