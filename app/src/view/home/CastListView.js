/*eslint-env browser */
import CastListElementView from "./CastListElementView.js";

class CastListView {

    constructor(){
        this.view = document.querySelector("#cast-list");
    }

    addElement(){
        let element = new CastListElementView();
        this.view.appendChild(element.getView());
    }

}
export default CastListView;