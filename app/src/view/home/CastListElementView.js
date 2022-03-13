/* eslint-env browser */

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView {

    constructor(){
        this.view = this.createView();
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