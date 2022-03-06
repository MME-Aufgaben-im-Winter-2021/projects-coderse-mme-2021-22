/* eslint-env browser */
import {Observable} from "../../../utils/Observable.js";
import DropView from "./DropView.js";

class CodeView extends Observable {
    constructor(){
        super();
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready", this.handleFile.bind(this));
        this.dropView.addEventListener("file-dropped", e => {this.notifyAll(e);});
        this.dropView.addEventListener("file-selected", e => {this.notifyAll(e);});
        this.container = document.querySelector(".main-right-code-container");
        this.container.addEventListener("mouseup", this.onTextSelected.bind(this));
    }

    // Shows File
    handleFile(event) {
        let codeInput = event.data;
        this.container.innerHTML = codeInput;
    }

    // Marks a text selection
    // Influenced by: https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript#8644513
    onTextSelected(){
        let range = window.getSelection().getRangeAt(0),
            selectionContents = range.extractContents(),
            mark = document.createElement("mark");

        mark.appendChild(selectionContents);
        range.insertNode(mark);
    }

    // Inform CastController
    onFileDropped(file){
        this.dropView.onFileDropped(file);
    }
}
export default CodeView;