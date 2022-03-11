/* eslint-env browser */

import { createSession } from "../../api/Session/createSession.js";
import Observable from "../../utils/Observable.js";

class LoginManager extends Observable {

    constructor(){
        super();
    }

    createSession(email, password){
        let promise = createSession(email,password);
        computePromise(promise);
    }

}

function computePromise(promise){
    promise.then(res => {
        console.log("SUCCESS", res);
    }, error => {
        console.log("ERROR", error);
    });
}

export default LoginManager;