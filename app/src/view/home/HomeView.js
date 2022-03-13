/* eslint-env browser */
import CastListView from "./CastListView.js";

class HomeView{

    constructor(){
        this.answerView = document.getElementById("server-answer");
        this.castListView = new CastListView();
    }

    setServerAnswer(string){
        this.answerView.innerText = string; 
        console.log(string);
    }

    addElement(){
        this.castListView.addElement();
    }

}

export default HomeView;