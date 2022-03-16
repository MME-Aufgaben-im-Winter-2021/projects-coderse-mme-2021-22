/* eslint-env browser */
import Observable from "../../utils/Observable.js";
import CastListView from "./CastListView.js";

class HomeView extends Observable {

    constructor() {
        super();
        this.answerView = document.getElementById("server-answer");
        this.castListView = new CastListView();
        this.castListView.addEventListener("on-view", (event) => this.notifyAll(event));
    }

    setServerAnswer(string) {
        this.answerView.innerText = string;
    }

    addElement(title, id, link) {
        this.castListView.addElement(title, id, link);
    }

}

export default HomeView;