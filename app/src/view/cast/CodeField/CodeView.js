/* eslint-env browser */
import { Observable } from "../../../utils/Observable.js";
import DropView from "./DropView.js";

class CodeView extends Observable {
    constructor() {
        super();
        this.dropView = new DropView();
        this.dropView.addEventListener("file-ready", this.handleFile.bind(this));
        this.dropView.addEventListener("file-dropped", e => { this.notifyAll(e); });
        this.dropView.addEventListener("file-selected", e => { this.notifyAll(e); });
        this.container = document.querySelector(".main-right-code-container");
        this.container.addEventListener("mouseup", this.onTextSelected.bind(this));
    }

    // Shows File
    handleFile(event) {
        let codeInput = event.data;
        this.container.innerText = codeInput;
    }

    // Marks a text selection
    // Influenced by: https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript#8644513
    onTextSelected() {
        let selection = window.getSelection();
        if (selection.anchorNode === null) {
            return;
        }
        var range = selection.getRangeAt(0),
            selectionContents,
            mark = document.createElement("mark");
        if (!selection.anchorNode.parentElement.classList.contains("main-right-code-container") && !(selection
                .anchorNode.parentElement.tagName === "MARK") && !(selection
                .anchorNode.parentElement.tagName === "SPAN")) {
            this.clearSelection();
            return;
        }

        selectionContents = range.extractContents();
        mark.appendChild(selectionContents);
        range.insertNode(mark);

        this.clearMarkings(selection.focusOffset, mark);

        this.clearSelection();
    }

    clearSelection() {
        //https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript#3169849 Abgerufen am 07.03.22
        if (window.getSelection().empty) {
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
        }
    }

    // Inform CastController
    onFileDropped(file) {
        this.dropView.onFileDropped(file);
    }

    // Removes overlapping and empty marks
    clearMarkings(offset, mark) {
        let markings,
            elements, prevEl,
            range = document.createRange(),
            textEl = document.createElement("span"),
            textContent, emptyMark, spans;
        if (mark.previousSibling.nodeType ===
            3) { //if the previous element of the mark element is text, the text is packed in a span, so that it stays in the same position when connecting the mark elements
            range.setStart(mark.previousSibling, 0);
            range.setEnd(mark, 0);
            textContent = range.extractContents();
            textEl.appendChild(textContent);
            range.insertNode(textEl);
            emptyMark = textEl.querySelector("mark");
            emptyMark.parentElement.removeChild(emptyMark);
        }
        markings = document.querySelectorAll(
        ".main-right-code-container > mark"); //remove empty top level mark tags
        markings.forEach(mark => {
            if (mark.innerHTML.length === 0) {
                mark.parentNode.removeChild(mark);
            }
        });
        spans = document.querySelectorAll(".main-right-code-container > span"); //remove empty top level span tags
        spans.forEach(span => {
            if (span.innerHTML.length === 0) {
                span.parentNode.removeChild(span);
            }
        });
        markings = document.querySelectorAll(
        ".main-right-code-container > mark"); //replace all child mark tags of a top level mark tag with their content
        markings.forEach(mark => {
            let els = mark.querySelectorAll("mark");
            els.forEach(el => {
                el.replaceWith(el.innerText);
            });
        });
        elements = document.querySelectorAll(".main-right-code-container > *");
        prevEl = elements[0];
        for (let i = 1; i < elements.length - 1; i++) { //connect two consecutive mark elements to one
            if (prevEl.tagName === "MARK" && elements[i].tagName ===
                "MARK") {
                let newMark = document.createElement("mark");
                newMark.innerText = prevEl.innerText + elements[i].innerText;
                prevEl.parentNode.insertBefore(newMark, prevEl);
                prevEl.parentNode.removeChild(prevEl);
                elements[i].parentNode.removeChild(elements[i]);
                prevEl = newMark;
            } else {
                prevEl = elements[i];
            }
        }
    }
}

export default CodeView;