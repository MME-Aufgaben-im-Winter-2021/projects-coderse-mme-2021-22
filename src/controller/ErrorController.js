/* eslint-env browser */

// Just a Controller to handle 404 Errors 
class ErrorController {

    init(navView){
        
        // Navbar View
        this.navView = navView;
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
    }

}

export default ErrorController;