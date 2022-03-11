import AppController from "./controller/AppController.js";

// Starting point of project CODERSE
function start() {
    // Init your App Controller and set the Starting page (Login in this case)
    let app = new AppController();
    // Set your landing page - if you are a developer use "create" to start with the cast create page
    app.setHash("login");
}

start();
