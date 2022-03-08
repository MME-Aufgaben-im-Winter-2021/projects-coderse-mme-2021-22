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

    showButton() {
        this.dropView.showButton();
    }

    hideButton() {
        this.dropView.hideButton();
    }

    // Shows File
    handleFile(event) {
        this.dropView.showButton();
        let codeInput = event.data;
        this.container.innerText = codeInput;
    }

    // Marks a text selection
    // Influenced by: https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript#8644513
    onTextSelected() {
        let selection = window.getSelection(),
            range, selectionContents, mark;
        if (selection.anchorNode === null) {
            return;
        }
        range = selection.getRangeAt(0);
        mark = document.createElement("mark");
        mark.classList.add("marking");
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

    //assigns a data-property to the new markings
    assignNewMarkings(id) {
        let newMarkings = document.querySelectorAll("mark");
        if (newMarkings) {
            for (let i = 0; i < newMarkings.length; i++) {
                if (!newMarkings[i].hasAttribute("data-id")) {
                    newMarkings[i].setAttribute("data-id", id);
                }
            }
        }
        console.log(newMarkings, "here", id);
    }

    //remove markings by id
    removeMarkingsById(id) {
        let markings = document.querySelectorAll(
            `.main-right-code-container > mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.replaceWith(el.innerText);
        });
    }

    //removes markings that aren't connected to a voice recording
    removeUnconnectedMarkings() {
        let markings = document.querySelectorAll("mark");
        markings.forEach(el => {
            if (!el.hasAttribute("data-id")) {
                el.replaceWith(el.innerText);
            }
        });
    }

    hideMarking(id) {
        let markings = document.querySelectorAll(
            `.main-right-code-container > mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking");
        });
    }

    highlightMarking(id) {
        let markings = document.querySelectorAll(
            `.main-right-code-container > mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.add("marking-highlight");
            el.classList.remove("marking");
        });
    }

    resetMarking(id) {
        let markings = document.querySelectorAll(
            `.main-right-code-container > mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking-highlight");
            el.classList.add("marking");
        });
    }

    // Removes overlapping and empty marks
    clearMarkings(offset, mark) {
        let markings,
            elements, prevEl,
            range = document.createRange(),
            textEl = document.createElement("span"),
            textContent, emptyMark, spans;
        if (mark.previousSibling.nodeType ===
            3
        ) { //if the previous element of the mark element is text, the text is packed in a span, so that it stays in the same position when connecting the mark elements
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
        //replace all child mark tags of a top level mark tag with their content TODO: replace sth? based on id???
        markings = document.querySelectorAll(".main-right-code-container > mark");
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
                // if() check for previous id and connect only when id is same and then give new mark the same id
                if (prevEl.getAttribute("data-id") === elements[i].getAttribute("data-id")) {
                    let newMark = document.createElement("mark");
                    newMark.classList.add("marking");
                    if (prevEl.getAttribute("data-id")) {
                        newMark.setAttribute("data-id", prevEl.getAttribute("data-id"));
                    }
                    newMark.innerText = prevEl.innerText + elements[i].innerText;
                    prevEl.parentNode.insertBefore(newMark, prevEl);
                    prevEl.parentNode.removeChild(prevEl);
                    elements[i].parentNode.removeChild(elements[i]);
                    prevEl = newMark;
                }
            } else {
                prevEl = elements[i];
            }
        }
    }
}

export default CodeView;