/* eslint-env browser */

import HomeView from "../view/home/HomeView.js";

import HomeManager from "../model/home/HomeManager.js";
import Observable from "../utils/Observable.js";
import { getUser } from "../api/User/getUser.js";
import LocalStorageProvider from "../utils/LocalStorageProvider.js";
import { generateIntroModal } from "../view/utilViews/Modal.js";

//Controls the Home page
class HomeController extends Observable {

    init(navView) {

        // Navbar View
        this.navView = navView;
        this.navView.showLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.setHomeActive();
        this.navView.showNavView();

        // Home general View
        this.homeView = new HomeView();
        this.homeView.addEventListener("on-view", (event) => this.notifyAll(event));
        this.homeView.addEventListener("on-delete", this.onDeleteCast.bind(this));
        this.homeView.addEventListener("ad-status", (event) => this.notifyAll(event));
        this.homeView.addEventListener("home-help-clicked", this.showTutorial.bind(this));

        // Data manager of this Controller
        this.homeManager = new HomeManager();
        this.homeManager.addEventListener("casts-retrieved", this.onCastsRetrieved.bind(this));

        this.getCasts();
        this.computeOnboarding();
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
                if (document.userID === user.$id) {
                    let title = document.title,
                        id = document.$id,
                        link = "https://coderse.software-engineering.education/#/share/" + id;
                    this.homeView.addElement(title, id, link);
                }

            });
            return user;
        }).then((user) => {
            let counter = 0;
            data.documents.forEach(document => {
                // Hand document 
                if (document.userID === user.$id) {
                    counter++;
                }

            });
            this.homeView.setNumOfCasts(counter);
        });
    }

    // If a cast should be deleted, the home manager will take care, by handing the id
    // Afterwards the current List Element is updated
    async onDeleteCast(event) {
        let castID = event.data;
        await this.homeManager.deleteCast(castID);
        this.getCasts();
    }
    // Tutorial of the home-screen. Shows up at first opening or by clicking on the questionmark-button
    showTutorial() {
        let createCastM, accountM, homeM;

        createCastM = generateIntroModal("Create cast",
            `Let's create a new cast! <br> 
        Click on "Create cast" `);

        accountM = generateIntroModal("Account",
            `View your <strong>account settings</strong> 
        or <strong>logout</strong> by clicking on your username.`,
            createCastM);

        homeM = generateIntroModal("Home",
            `This is your <strong>homescreen</strong>! 
         You can see you saved pod ... eh codecasts. 
         You can share or delete every cast. 
         To edit a cast just click on it.`,
            accountM);

        generateIntroModal("Welcome to CODERSE!",
            `Hey😋<br> 
        This is your place to comment your code with audio-records and spread it to the world.`,
            homeM);
    }

    computeOnboarding() {
        let onBoardingDone = LocalStorageProvider.getCreateCastOnBoarding();
        if (onBoardingDone === null || onBoardingDone === "start") {
            this.showTutorial();
        }
    }

}

export default HomeController;