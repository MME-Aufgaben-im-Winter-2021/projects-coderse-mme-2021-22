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
        this.deleteCast = this.view.querySelector("#delete-cast-btn");
        this.deleteCast.addEventListener("click", this.onDeleteCast.bind(this));
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
        this.view.setAttribute("data-id", id);
    }

    getID() {
        return this.view.getAttribute("data-id");
    }

    onDeleteCast(){
        let event = new Event("on-delete", this.getID());
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