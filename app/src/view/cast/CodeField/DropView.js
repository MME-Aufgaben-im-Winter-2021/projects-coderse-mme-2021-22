/* eslint-env browser */
import { Observable, Event } from "../../../utils/Observable.js";
import DropZone from "./DropZone.js";

// View for the Code section of the cast edit
class DropView extends Observable {

    constructor() {
        super();
        this.view = document.querySelector(".main-right-drag-drop-container");
        this.dropZone = new DropZone();
        this.dropZone.addEventListener("file-dropped", e => { this.notifyAll(e); });
        this.dropZone.addEventListener("file-not-valid", this.hideButton.bind(this));
        this.chooseFileBtn = this.view.querySelector(".main-right-drag-drop-container-btn-select-file");
        this.chooseFileBtn.addEventListener("click", this.onSelectFileFromDiscClicked.bind(this));
        this.startBtn = this.view.querySelector(".main-right-drag-drop-container-btn");
        this.startBtn.addEventListener("click", this.onFileReady.bind(this));
        this.currentFile = null;
        this.hidden = false;
    }

    hide(){
        this.view.classList.add("hidden");
        this.hidden = true;
    }

    // Reads a file with FileReader
    // Source: https://riptutorial.com/javascript/example/7081/read-file-as-string
    onFileReady() {
        let reader = new FileReader();
        // If a file is loaded, it fires a event with the file converted to a string
        reader.onload = (ev) => {
            let event = new Event("file-ready", ev.target.result);
            this.notifyAll(event);
            this.hide();
        };
        // If a file is available it is parsed to text
        if (this.currentFile !== null) {
            reader.readAsText(this.currentFile);
        }
    }

    // Informs CodeView and stores the current file
    onFileDropped(file) {
        this.showButton();
        this.dropZone.onFileDropped(file);
        this.currentFile = file;
    }

    showButton() {
        this.startBtn.classList.remove("hidden");
    }

    hideButton() {
        this.startBtn.classList.add("hidden");
    }

    // https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js#16215950
    onSelectFileFromDiscClicked() {
        let inputEl = document.createElement("input");
        inputEl.setAttribute("type", "file");
        inputEl.setAttribute("name", "file");
        inputEl.style.display = "none";
        inputEl.click();

        inputEl.onchange = ev => {
            this.currentFile = ev.target.files[0];
            let event = new Event("file-selected", this.currentFile);
            this.notifyAll(event);
        };
    }
}

export default DropView;