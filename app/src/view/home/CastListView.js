/*eslint-env browser */
import Observable from "../../utils/Observable.js";
import CastListElementView from "./CastListElementView.js";

class CastListView extends Observable {

    constructor() {
        super();
        this.view = document.querySelector("#cast-list");
    }

    addElement(title, id) {
        let element = new CastListElementView(title, id);
        element.addEventListener("link-copy", (event) => this.notifyAll(event));
        element.addEventListener("on-view", (event) => this.notifyAll(event));
        this.view.appendChild(element.getView());
    }

}
export default CastListView;