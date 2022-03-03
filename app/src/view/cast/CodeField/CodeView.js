/* eslint-env browser */
import {Observable} from "../../../utils/Observable.js";
import DropView from "./DropView.js";

// View for the Code section of the Cast edit
var codeInput, selectedCode;
class CodeView extends Observable {
    constructor(){
        super();
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready", this.handleFile.bind(this));
        this.dropView.addEventListener("file-dropped", e => {this.notifyAll(e);});
        this.dropView.addEventListener("file-selected", e => {this.notifyAll(e);});
        this.container = document.querySelector(".main-right-code-container");
    }

    // Shows File
    handleFile(event) {
        this.container.innerHTML = event.data;
        codeInput = this.container.innerHTML;
        //this.getSelectedArea(codeInput);
    }
    // (Clicked on button to mark file and) get the selected area
    getSelectedArea(codeInput){
        selectedCode = document.querySelector(codeInput).select();
        //document.querySelector("button").onClick = function(){}
        this.markSelectedArea(selectedCode);
        //In Zwischenablage
        //document.execCommand('copy');
    }
    // Marks selected area in File 
    markSelectedArea(selectedCode){
            selectedCode.style.backgroundColor = "yellow";
    }
    // Inform CastController
    onFileDropped(file){
        this.dropView.onFileDropped(file);
    }
}

export default CodeView;