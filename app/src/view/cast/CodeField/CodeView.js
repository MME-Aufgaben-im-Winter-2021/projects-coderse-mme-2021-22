/* eslint-env browser */
import DropView from "./DropView.js";

// View for the Code section of the Cast edit
class CodeView {
    constructor(){
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready", this.handleFile.bind(this));
        this.container = document.querySelector(".main-right-code-container");
    }

    handleFile(event) {
        this.container.innerHTML = event.data;
    }
}

export default CodeView;