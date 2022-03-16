/* eslint-env browser */
import { Observable, Event } from "../../utils/Observable.js";

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView extends Observable {

    constructor(title, id, link) {
        super();
        this.view = this.createView();
        this.setTitle(title);
        this.copyLink = this.view.querySelector("#copy-link");
        this.viewCast = this.view.querySelector("#view-btn");
        this.viewCast.addEventListener("click", this.onViewCast.bind(this));
        this.setID(id);
        this.setLink(link);
    }

    setTitle(title) {
        this.view.querySelector(".cast-title").innerText = title;
    }

    setLink(link){
        this.copyLink.value = link;
    }

    setID(id) {
        this.viewCast.setAttribute("data-id", id);
    }

    getID() {
        return this.viewCast.getAttribute("data-id");
    }

    onViewCast() {
        let event = new Event("on-view", this.getID());
        this.notifyAll(event);
    }

    createView() {
        let element = document.createElement("div");
        element.innerHTML = TEMPLATE;
        return element.firstChild;
    }

    getView() {
        return this.view;
    }

}
export default CastListElementView;