/* eslint-env browser */
import AccountManager from "../model/account/AccountManager.js";
import { Observable, Event } from "../utils/Observable.js";
import AccountView from "../view/account/AccountView.js";

class AccountController extends Observable {

    init(navView) {

        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setUserActive();

        this.accountView = new AccountView();
        this.accountView.addEventListener("account-submit", this.onAccountSubmit.bind(this));
        this.accountView.addEventListener("account-delete", this.onAccountDelete.bind(this));

        this.accountManager = new AccountManager();
        this.accountManager.addEventListener("update-error", this.onUpdateError.bind(this));
        this.accountManager.addEventListener("update-success", this.onUpdateSuccess.bind(this));
    }
    // Sets the user data in Accountscreen
    fillUserData(accountData) {
        let username = accountData.user.name,
            email = accountData.user.email;
        this.accountManager.currentUsername = username;
        this.accountManager.currentEmail = email;
        this.accountView.setUsername(username);
        this.accountView.setEmail(email);
    }
    // Called if there are changes in user data
    onAccountSubmit(event) {
        let username = event.data.username,
            email = event.data.email,
            password = event.data.password;

        if (username.trim() === "") {
            username = email;
        }

        this.accountManager.onAccountSubmit(username, email, password);
    }

    // Deletes Account and linked codecasts. Reloads to switch to the login page.
    onAccountDelete(event){
       this.accountManager.onAccountDelete(event.data).catch(() => location.reload());
    }
    // Notifies if update is successful
    onUpdateSuccess(event) {
        this.notifyAll(new Event("account-update", event));
    }
    // Sets error if update is not successful
    onUpdateError(event) {
        this.accountView.setUsername(this.accountManager.currentUsername);
        this.accountView.setEmail(this.accountManager.currentEmail);
        this.accountView.clearPassword();
        this.accountView.setError(event.data);
    }

}

export default AccountController;