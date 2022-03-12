/* eslint-env browser */

import NavView from "../view/Navbar/NavView.js";

// Just a Controller to handle 404 Errors 
class ErrorController {

    init(){
        
        // Navbar View
        this.navView = new NavView();
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
    }

}

export default ErrorController;