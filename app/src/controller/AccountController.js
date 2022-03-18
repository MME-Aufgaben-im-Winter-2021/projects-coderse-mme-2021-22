/* eslint-env browser */

class AccountController {

    init(navView) {

        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setUserActive();

        this.viewUsername = document.getElementById("input-username");
        this.viewEmail = document.getElementById("input-email");
        this.viewPassword = document.getElementById("input-password");
        this.viewBtn = document.getElementById("input-btn");
    }

    //dont fill password -> check old password again with new field? TODO: 
    fillUserData(accountData) {
        this.viewUsername.value = accountData.user.name;
        this.viewEmail.value = accountData.user.email;
    }

}

export default AccountController;