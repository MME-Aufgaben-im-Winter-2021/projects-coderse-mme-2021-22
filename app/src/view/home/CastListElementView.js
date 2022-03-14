/* eslint-env browser */

const TEMPLATE = document.getElementById("home-cast-template").innerHTML.trim();

class CastListElementView {

    constructor(title){
        this.view = this.createView();
        this.setTitle(title);
    }

    setTitle(title){
        this.view.querySelector(".cast-title").innerText = title;
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