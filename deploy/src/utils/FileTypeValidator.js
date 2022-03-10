/* eslint-env browser */
import Config from "../utils/Config.js";

// File types which are accepted in the drag and drop zone
const VALID_FILES = Config.VALID_FILETYPES;

// Validator for File types
class FileTypeValidator{

    constructor(){
        this.file = null;
    }

    check(event) {
        this.file = checkFile(event);
    }

    getFile(){
        return this.file;
    }

    checkValidFileType(file){
        return checkValidFileType(file);
    }

}

// Checks if dropped file is actually a file and returns it if true
function checkFile(event){
    let res = "NOT A VALID FILE";
    if(event.dataTransfer.items) {
        // Check if dataTransfer is a file
        if(event.dataTransfer.items[0].kind === "file"){
            res = event.dataTransfer.items[0].getAsFile();
            // Check if the file is a valid type (e.g. java, txt, js)
            if (checkValidFileType(res)){
                return res;
            }
        }
    }
    
    // No valid file
    res = null;
    return res;
}

// Iterates through all valid file types -> returns true if file is valid type
function checkValidFileType(file){
    let boolean = false;
    VALID_FILES.forEach((element) => {
        // Checks if filename e.g. main.java includes a valid file type (String is in the file name -> valid)
        if (file.name.includes(element)) {
            boolean = true;
        }
    });
    return boolean;
}

export default new FileTypeValidator();