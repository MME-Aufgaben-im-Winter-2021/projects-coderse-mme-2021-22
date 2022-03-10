import AppController from "./controller/AppController.js";

// Starting point of project CODERSE
function start() {
    // Init your App Controller and set the Starting page (Login in this case)
    let app = new AppController();
    app.setHash("login");
}

start();
