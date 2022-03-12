/* eslint-env browser */

import NavView from "../view/Navbar/NavView.js";

class HomeController {

    init(){
        
        // Navbar View
        this.navView = new NavView();
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
    }

}

export default HomeController;