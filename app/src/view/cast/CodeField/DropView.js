/* eslint-env browser */
import { Observable, Event } from "../../../utils/Observable.js";
import DropZone from "./DropZone.js";

// View for the Code section of the Cast edit
class DropView extends Observable {
  constructor() {
    super();
    this.view = document.querySelector(".main-right-drag-drop-container");
    this.dropZone = new DropZone();
    this.startBtn = this.view.querySelector(
      ".main-right-drag-drop-container-btn");
    this.startBtn.addEventListener("click", this.handleStart.bind(this));
  }

  // Reads a file with FileReader
  // Source: https://riptutorial.com/javascript/example/7081/read-file-as-string
  handleStart() {
    let file = this.dropZone.getFile(),
      reader = new FileReader();
    // If a file is loaded, it fires a event with the file converted to a string
    reader.onload = (ev) => {
      let event = new Event("file-ready", ev.target.result);
      this.notifyAll(event);
      this.view.classList.add("hidden");
    };
    reader.readAsText(file);

  }
}

export default DropView;