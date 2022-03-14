/* eslint-env browser */


import HomeView from "../view/home/HomeView.js";

import HomeManager from "../model/home/HomeManager.js";

class HomeController {

    init(navView){
        
        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setHomeActive();

        // Home general View
        this.homeView = new HomeView();

        // Data Manager of this Controller
        this.homeManager = new HomeManager();
        this.homeManager.addEventListener("casts-retrieved", this.onCastsRetrieved.bind(this));

        this.getCasts();
    }

    // Tells the data manager to get the users casts from the DB
    getCasts(){
        this.homeManager.getCasts();
    }
    
    // When the casts for this user are retrieved, the data is passed to the views
    onCastsRetrieved(event){
        console.log(event);
        let data = event.data;
        this.homeView.setServerAnswer(data);
        data.documents.forEach(document => {
            // Hand document 
            console.log(document);
            this.homeView.addElement();
        });
    }

}

export default HomeController;