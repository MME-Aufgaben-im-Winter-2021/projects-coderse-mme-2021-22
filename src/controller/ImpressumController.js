/* eslint-env browser */

import Observable from "../utils/Observable.js";

//Controls the Impressum page
// There are general information of the developers and the curse
class ImpressumController extends Observable {

    init(navView) {

        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setImpressumActive();
        this.navView.showNavView();

    }
}
    export default ImpressumController;