/* eslint-env browser */
import { Observable, Event } from "../../utils/Observable.js";

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView extends Observable {

    constructor(title, id, link) {
        super();
        this.view = this.createView();
        this.setTitle(title);
        this.copyLink = this.view.querySelector("#copy-icon");
        this.viewCast = this.view.querySelector("#view-btn");
        this.deleteCast = this.view.querySelector("#delete-cast-btn");
        this.linkEl = this.view.querySelector("#copy-link");
        this.copyLink.addEventListener("click", this.onCopyLinkClicked.bind(this));
        this.deleteCast.addEventListener("click", this.onDeleteCast.bind(this));
        this.viewCast.addEventListener("click", this.onViewCast.bind(this));
        this.setID(id);
        this.setLink(link);
    }

    //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#using_the_clipboard_api Abgerufen am 22.03.22
    onCopyLinkClicked(){
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.writeText(this.linkEl.value).then(function() {
                    /* clipboard successfully set */
                  }, function() {
                    /* clipboard write failed */
                    console.log("error");
                  });
            }else{
                console.log("Couldn't save to clipboard -> permission denied or not on a chromium browser");
                //Print error
            }
          });
    }

    setTitle(title) {
        this.view.querySelector(".cast-title").innerText = title;
    }

    setLink(link){
        this.linkEl.value = link;
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