/*eslint-env browser */
import Observable from "../../utils/Observable.js";
import CastListElementView from "./CastListElementView.js";

class CastListView extends Observable {

    constructor() {
        super();
        this.view = document.querySelector("#cast-list");
    }

    addElement(title, id, link) {
        let element = new CastListElementView(title, id, link);
        element.addEventListener("on-view", (event) => this.notifyAll(event));
        this.view.appendChild(element.getView());
    }

}
export default CastListView;