import CastController from "./controller/castController.js";

function init() {
    initController();
}

// For all the controllers in the code cast edit 
function initController() {
    let castController = new CastController();
    castController.init();
}

init();