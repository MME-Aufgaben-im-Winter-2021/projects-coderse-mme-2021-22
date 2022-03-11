/* eslint-env browser */

import LoginView from "../view/login/LoginView.js";
import LoginManager from "../model/login/LoginManager.js";

class LoginController {

    init(){
        this.loginView = new LoginView();
        this.loginView.addEventListener("login-submit", this.onSubmit.bind(this));

        this.loginManager = new LoginManager();
    }

    async onSubmit(event){
        let email = event.data.email,
            password = event.data.password;
        this.loginManager.createSession(email, password);
    }

}

export default LoginController;