/* eslint-env browser */
import {Observable} from "../../../utils/Observable.js";
import DropView from "./DropView.js";

// View for the Code section of the Cast edit
var buttonAdd, 
    markedEl;

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
        let codeInput = event.data;
        buttonAdd = document.querySelector(".code-icon-add");
        buttonAdd.addEventListener("click", this.onMarkArea(codeInput));
    }
    // Marks area
    //TODO: Set Button-Listener and just mark selected part 
    //Clicked Line -> this.container.innerHTML split on this line -> set mark 
    onMarkArea(codeInput){
    console.log("Plus-Button");
    markedEl = document.createElement('mark');
    this.container.appendChild(markedEl);
        markedEl.innerHTML = codeInput;
    }
    // Inform CastController
    onFileDropped(file){
        this.dropView.onFileDropped(file);
    }
}
export default CodeView;