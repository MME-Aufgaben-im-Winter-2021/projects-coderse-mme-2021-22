/* eslint-env browser */

class AccountController {

    init(navView){
        
        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setUserActive();
    }

}

export default AccountController;