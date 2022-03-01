/* eslint-env browser */

// Drop Zone to drag files into the code field.
// For more details: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
class DropZone {

    constructor(){
        this.view = document.querySelector("#drop_zone");
        this.view.addEventListener("drop", this.handleDrop.bind(this));
        this.view.addEventListener("dragover", this.handleDragOver.bind(this));
        this.file = null;
    }

    handleDrop(event){
        event.preventDefault();
        let file = checkFile(event);
        console.log(file);
        this.view.innerHTML = file.name;
        this.file = file;
    }

    handleDragOver(event){
        event.preventDefault();
    }

    getFile(){
        return this.file;
    }
}

// Checks if dropped file is actually a file and returns it if true
function checkFile(event){
    let res = "NO FILE";
    if(event.dataTransfer.items) {
        if(event.dataTransfer.items[0].kind === "file"){
            res = event.dataTransfer.items[0].getAsFile();
        }
    }
    return res;
}

export default DropZone;