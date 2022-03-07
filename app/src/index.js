import CastController from "./controller/castController.js";
import Config from "./utils/Config.js";

const routes = Config.ROUTES;

var router;

function init() {
    router = new Router();
    // Changing the location on navigation
    document.querySelector(".home").addEventListener("click", event => router.route(event));
    initManagers();
    // Handle Location on page load
    router.handleLocation();
    // Listen to location changes
    window.addEventListener("popstate", (event) => router.handleLocation(event));
}

// For all the controllers in the code cast edit 
function initManagers() {
    let castController = new CastController();
}

// Retrieved from https://www.youtube.com/watch?v=ZleShIpv5zQ, 07.03.2022
class Router {

    route(event){
        let e = event || window.event,
            data = {};
        e.preventDefault();
        window.history.pushState(data, "", e.target.href);
    }

    async handleLocation(event){
        console.log("CHANGE", event);
        const path = window.location.pathname,
              route = routes[path] || routes[404],
              html = await fetch(route).then(data => console.log(data));
              
        // document.querySelector(".main-content").innerHTML = html;
    }

}

init();
