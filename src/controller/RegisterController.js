/* eslint-env browser */

import RegisterView from "../view/register/RegisterView.js";

import RegisterManager from "../model/register/RegisterManager.js";

// Controls the Register page.
// The Register Manager handles account creation.
// The Register View is there to show proceedings to the user. 
class RegisterController {

    init(navView){
        this.registerView = new RegisterView();
        this.registerView.addEventListener("account-submit", this.onSubmit.bind(this));

        // Navbar Viev
        this.navView = navView;
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();

        this.registerManager = new RegisterManager();
        this.registerManager.addEventListener("account-result", this.onAccountResult.bind(this));
    }

    // On submit button click the data from the inputs is used create an account in the database
    // TODO: username is not required from the DB side -> manually validation
    //       Maybe if the value is empty just use the email as the username -> would be unique
    onSubmit(event){
        let email = event.data.email,
            password = event.data.password,
            username = event.data.username;

        this.registerManager.createUser(email, password, username);
    }

    // If the result from the register try is ready, the user will be taken to the home page (if login was successful)
    onAccountResult(event){
        let bool = event.data.register;
        if(bool){
            // Instead of creating a session for the new user, we redirect to the login page
            // where he can login
            window.location.hash = "login";
    
        }
        this.registerView.setServerAnswer(event.data.answer);

    }

}

export default RegisterController;