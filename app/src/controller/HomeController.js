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
        this.homeView.addEventListener("link-copy", this.onCopyLink.bind(this));

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
        let data = event.data;
        this.homeView.setServerAnswer(data);
        data.documents.forEach(document => {
            // Hand document 
            let title = document.title,
                id = document.$id;
            this.homeView.addElement(title, id);
        });
    }

    onCopyLink(event){
        let id = event.data,
            url = "http://localhost:8080/#/share/" + id;
        navigator.clipboard.writeText(url);
    }

}

export default HomeController;