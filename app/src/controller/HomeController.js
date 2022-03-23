/* eslint-env browser */

import HomeView from "../view/home/HomeView.js";

import HomeManager from "../model/home/HomeManager.js";
import Observable from "../utils/Observable.js";
import { getUser } from "../api/User/getUser.js";

class HomeController extends Observable {

    init(navView) {

        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setHomeActive();

        // Home general View
        this.homeView = new HomeView();
        this.homeView.addEventListener("on-view", (event) => this.notifyAll(event));
        this.homeView.addEventListener("on-delete", this.onDeleteCast.bind(this));

        // Data Manager of this Controller
        this.homeManager = new HomeManager();
        this.homeManager.addEventListener("casts-retrieved", this.onCastsRetrieved.bind(this));

        this.getCasts();
    }

    // Tells the data manager to get the users casts from the DB
    getCasts() {
        this.homeView.clearList();
        this.homeManager.getCasts();
    }

    // When the casts for this user are retrieved, the data is passed to the views
    // Looks for the currently logged user, and only retrieves his casts
    onCastsRetrieved(event) {
        let data = event.data;
        getUser().then(res => {
            let user = res;
            data.documents.forEach(document => {
                // Hand document 
                if(document.userID === user.$id){
                    let title = document.title,
                        id = document.$id,
                        link = "http://coderse.software-engineering.education/#/share/" + id;
                    this.homeView.addElement(title, id, link);
                }
                
            });
        });
    }

    // If a cast should be deleted, the home manager will take care, by handing the id
    // Afterwards the current List Element is updated
    async onDeleteCast(event){
        let castID = event.data;
        await this.homeManager.deleteCast(castID);
        this.getCasts();
    }

}

export default HomeController;