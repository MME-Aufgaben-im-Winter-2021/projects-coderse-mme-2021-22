/* eslint-env browser */

import {Observable, Event} from "./Observable.js";

const ROUTES = {
    404: "./src/pages/404.html",
    "#create": "./src/pages/createCast.html",
    "#home": "./src/pages/home.html",
    "#login": "./src/pages/login.html",
    "#account": "./src/pages/account.html",
    "#register": "./src/pages/register.html",
};

// Router Class to navigate between pages with templates
class Router extends Observable {

    constructor(){
        super();
    }

    // Pushes a route on the "stack" -> enables navigation via browser arrow keys
    pushRoute(event){
        event.preventDefault();
        let url = event.target.href;
        history.pushState(null,null,url);
        // Push state does not fire hashchange -> dispatch the event on the window
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }

    // When the URL hash changes the linked html template is retrieved
    // When the route is not available a 404 Error page will be shown
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
        console.trace();
        console.log("Fetching ", route);    
    }
}

export default Router;