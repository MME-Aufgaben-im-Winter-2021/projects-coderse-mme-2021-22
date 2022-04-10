/* eslint-env browser */
import Config from "../../../utils/Config.js";
import {Observable, Event} from "../../../utils/Observable.js";

const VALID_FILES = Config.VALID_FILETYPES;

// Drop Zone to drag files into the code field
// For more details: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
class DropZone extends Observable {

    constructor(){
        super();
        this.view = document.querySelector("#drop_zone");
        this.view.addEventListener("drop", this.handleDrop.bind(this));
        this.view.addEventListener("dragover", this.handleDragOver.bind(this));
    }

    handleDrop(ev){
        ev.preventDefault();
        let event = new Event("file-dropped", ev);
        this.notifyAll(event);
    }

    handleDragOver(event){
        event.preventDefault();
    }

    onFileDropped(file){
        // Only accepts file if its a valid type -> not null
        // checkFile returns null if a file is not valid
        if (file !== null){
            this.view.innerHTML = file.name;
            this.file = file;
        }
            // If a file is not valid, a error message is displayed to the user
        else {
            let event = new Event("file-not-valid", "not valid");
            this.notifyAll(event);
            this.view.innerHTML = "That is not a valid file type. \nValid file types are: <strong>" + VALID_FILES + "</strong>";
        }
    }

}

export default DropZone;