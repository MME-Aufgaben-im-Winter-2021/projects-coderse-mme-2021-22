import CastController from "./controller/castController.js";

function init() {

  console.log("### Starting MME Project ###");
  console.log('Hello World!');
  initControllers();
}

// For all the controllers in the code cast edit 
function initControllers() {
  let castController = new CastController();
}

init();