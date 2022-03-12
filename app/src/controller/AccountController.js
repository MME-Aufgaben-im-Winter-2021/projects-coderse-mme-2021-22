/* eslint-env browser */

import NavView from "../view/Navbar/NavView.js";

class AccountController {

    init(){
        
        // Navbar View
        this.navView = new NavView();
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
    }

}

export default AccountController;