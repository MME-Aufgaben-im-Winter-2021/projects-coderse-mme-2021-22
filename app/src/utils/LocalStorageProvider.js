/* eslint-env browser */
import Config from "./Config.js";

class LocalStorageProvider {

    setCreateCastOnBoarding(value){
        localStorage.setItem(Config.LS_KEY_CAST_ONBOARDING, value);
    }

    getCreateCastOnBoarding(){
        return localStorage.getItem(Config.LS_KEY_CAST_ONBOARDING);
    }

}

export default new LocalStorageProvider;