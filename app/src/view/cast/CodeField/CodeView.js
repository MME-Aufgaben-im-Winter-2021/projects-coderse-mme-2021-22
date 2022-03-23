/* eslint-env browser */
import Config from "../../../utils/Config.js";
import { Event, Observable } from "../../../utils/Observable.js";

const CodeMirror = window.CodeMirror;

class CodeView extends Observable {

    constructor() {
        super();
        this.container = document.querySelector(".main-right-code-container");
        this.container.addEventListener("mouseup", this.onTextSelected.bind(this));
        this.test = document.querySelector(".test-container");
    }

    startShareViewMode() {
        this.container.style.userSelect = "none";
    }

    // Shows File 
    showFile(codeInput) {
        console.log(codeInput);
        this.container.classList.remove("hidden");
        // this.container.innerText = codeInput;
        this.startCodeMirror(codeInput);
    }

    showLoadedFile(codeInput) {
        console.log(typeof codeInput);
        this.container.classList.remove("hidden");
        // this.container.value = codeInput;
        this.startCodeMirror(codeInput);
    }

    startCodeMirror(input){
        this.codeMirror = CodeMirror(this.container, {
            value: input,
            theme: "monokai",
            lineNumbers: true,
            scrollbarStyle: null,
        });
        this.codeMirror.on("mouseup beforeSelectionChange", (event) => console.log(event));
    }

    // Marks a text selection
    // Influenced by: https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript#8644513
    onTextSelected() {
        let selections = this.codeMirror.listSelections(),
            anchor = selections[0].anchor,
            head = selections[0].head;
        this.codeMirror.markText({
            line: anchor.line,
            ch: anchor.ch,
        },{
            line: head.line +1, 
            ch: 0,
        },{
            className: "marking",
            readOnly: true,
        });
    }

    clearSelection() {
        //https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript#3169849 Abgerufen am 07.03.22
        if (window.getSelection().empty) {
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
        }
    }

    //assigns a data-property to the new markings
    assignNewMarkings(id) {
        let newMarkings = document.querySelectorAll(".marking");
        if (newMarkings) {
            for (let i = 0; i < newMarkings.length; i++) {
                if (!newMarkings[i].hasAttribute("data-id")) {
                    console.log(newMarkings);
                    newMarkings[i].setAttribute("data-id", id);
                    newMarkings[i].addEventListener("mouseover", this.onMouseOverMarking.bind(this, id));
                    newMarkings[i].addEventListener("mouseout", this.onMouseOutMarking.bind(this, id));
                }
            }
        }
    }
    
    // Sends id from hover over markings to CastController
    onMouseOverMarking(id) {
        let event = new Event("marking-mouse-over", id);
        this.notifyAll(event);
    }

    // Stops hover over markings 
    onMouseOutMarking(id) {
        let event = new Event("marking-mouse-out", id);
        this.notifyAll(event);
    }

    //remove markings by id
    removeMarkingsById(id) {
        let markings = document.querySelectorAll(
            `span[data-id="${id}"]`);
        markings.forEach(el => {
            el.replaceWith(el.innerText);
        });
    }

    //removes markings that aren't connected to a voice recording
    removeUnconnectedMarkings() {
        let markings = document.querySelectorAll(".markings");
        markings.forEach(el => {
            if (!el.hasAttribute("data-id")) {
                el.replaceWith(el.innerText);
            }
        });
    }

    hideMarking(id) {
        let markings = document.querySelectorAll(
            `span[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking");
        });
    }

    highlightMarking(id) {
        let markings = document.querySelectorAll(
            `span[data-id="${id}"]`);
        markings.forEach(el => {
            if (!el.classList.contains("marking-highlight-play")) {
                el.classList.add("marking-highlight");
            }
            el.classList.remove("marking");
        });
    }

    resetMarking(id) {
        let markings = document.querySelectorAll(
            `span[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking-highlight");
            if (!el.classList.contains("marking-highlight-play")) {
                el.classList.add("marking");
            }
        });
    }

    highlightPlayMarking(id) {
        let markings = document.querySelectorAll(`span[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.add("marking-highlight-play");
            el.classList.remove("marking");
        });
    }

    resetPlayMarking(id) {
        let markings = document.querySelectorAll(`span[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking-highlight-play");
            el.classList.add("marking");
        });
    }

    // Removes overlapping and empty marks
    clearMarkings(mark) {
        let markings,
            elements, prevEl,
            range = document.createRange(),
            textEl = document.createElement("span"),
            textContent, emptyMark, spans;
        //if the previous element of the mark element is text, the text is packed in a span, so that it stays in the same position when connecting the mark elements
        if (mark.previousSibling.nodeType === Config.NODE_TYPE_TEXT) {
            range.setStart(mark.previousSibling, 0);
            range.setEnd(mark, 0);
            textContent = range.extractContents();
            textEl.appendChild(textContent);
            range.insertNode(textEl);
            emptyMark = textEl.querySelector("mark");
            emptyMark.parentElement.removeChild(emptyMark);
        }
        //remove empty top level mark tags
        markings = document.querySelectorAll(".main-right-code-container > mark");
        markings.forEach(mark => {
            if (mark.innerHTML.length === 0) {
                mark.parentNode.removeChild(mark);
            }
        });
        //remove empty top level span tags
        spans = document.querySelectorAll(".main-right-code-container > span");
        spans.forEach(span => {
            if (span.innerHTML.length === 0) {
                span.parentNode.removeChild(span);
            }
        });
        //replace all child mark tags of a top level mark tag with their content
        markings = document.querySelectorAll(".main-right-code-container > mark");
        markings.forEach(mark => {
            let els = mark.querySelectorAll("mark");
            els.forEach(el => {
                el.replaceWith(el.innerText);
            });
        });
        elements = document.querySelectorAll(".main-right-code-container > *");
        prevEl = elements[0];
        //connect two consecutive mark elements to one
        for (let i = 1; i < elements.length - 1; i++) {
            if (prevEl.tagName === "MARK" && elements[i].tagName === "MARK") {
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

    getHTML() {
        this.removeUnconnectedMarkings();
        return this.container.innerHTML;
    }
}

export default CodeView;