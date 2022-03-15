/* eslint-env browser */
import {Observable, Event} from "../../utils/Observable.js";

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView extends Observable {

    constructor(title, id){
        super();
        this.view = this.createView();
        this.setTitle(title);
        this.setID(id);
        this.copyLink = this.view.querySelector("#copy-link");
        this.copyLink.addEventListener("click", this.onLinkCopy.bind(this));
    }

    setTitle(title){
        this.view.querySelector(".cast-title").innerText = title;
    }

    setID(id){
        this.view.querySelector(".cast-id").innerText = id;
    }

    getID(){
        return this.view.querySelector(".cast-id").innerText;
    }

    onLinkCopy(){
        let event = new Event("link-copy",this.getID());
        this.notifyAll(event);
    }

    createView(){
        let element = document.createElement("div");
        element.innerHTML = TEMPLATE;
        return element.firstChild;
    }

    getView(){
        return this.view;
    }

}
export default CastListElementView;