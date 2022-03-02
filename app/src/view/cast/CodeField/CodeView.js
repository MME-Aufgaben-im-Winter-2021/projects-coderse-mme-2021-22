/* eslint-env browser */
import {Observable} from "../../../utils/Observable.js";
import DropView from "./DropView.js";

// View for the Code section of the Cast edit
class CodeView extends Observable {
    constructor(){
        super();
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready", this.handleFile.bind(this));
        this.dropView.addEventListener("file-dropped", e => {this.notifyAll(e);});
        this.container = document.querySelector(".main-right-code-container");
    }

    //shows File
    handleFile(event) {
        this.container.innerHTML = event.data;
    }

    //informs CastController
    onFileDropped(file){
        this.dropView.onFileDropped(file);
    }
}

export default CodeView;