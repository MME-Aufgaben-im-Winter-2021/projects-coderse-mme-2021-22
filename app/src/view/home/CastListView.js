/*eslint-env browser */
import CastListElementView from "./CastListElementView.js";

class CastListView {

    constructor(){
        this.view = document.querySelector("#cast-list");
    }

    addElement(title){
        let element = new CastListElementView(title);
        this.view.appendChild(element.getView());
    }

}
export default CastListView;