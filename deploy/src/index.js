import CastController from "./controller/CastController.js";

function init() {
    initController();
}

// For all the controllers in the code cast edit 
function initController() {
    let castController = new CastController();
    castController.init();
}

init();