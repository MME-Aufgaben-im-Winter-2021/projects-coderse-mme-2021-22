/* eslint-env browser */
import { Observable, Event } from "../../utils/Observable.js";

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView extends Observable {

    constructor(title, id) {
        super();
        this.view = this.createView();
        this.setTitle(title);
        this.copyLink = this.view.querySelector("#copy-link");
        this.copyLink.addEventListener("click", this.onLinkCopy.bind(this));
        this.viewCast = this.view.querySelector("#view-btn");
        this.viewCast.addEventListener("click", this.onViewCast.bind(this));
        this.setID(id);
    }

    setTitle(title) {
        this.view.querySelector(".cast-title").innerText = title;
    }

    setID(id) {
        this.viewCast.setAttribute("data-id", id);
    }

    getID() {
        return this.viewCast.getAttribute("data-id");
    }

    onLinkCopy() {
        let event = new Event("link-copy", this.getID());
        this.notifyAll(event);
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