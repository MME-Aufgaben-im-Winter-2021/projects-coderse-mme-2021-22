/* eslint-env browser */
import { Event, Observable } from "../../../utils/Observable.js";

const hljs = window.hljs;

class CodeView extends Observable {

    constructor() {
        super();
        this.container = document.querySelector(".main-right-code-container");
        this.container.addEventListener("mouseup", this.onTextSelected.bind(this));
        this.fabHelp = document.querySelector(".fab-help");
        this.fabHelp.addEventListener("click", () => {this.notifyAll(new Event("code-help-clicked"));});
    }

    hideFabHelp(){
        this.fabHelp.classList.add("hidden");
    }

    startShareViewMode() {
        this.container.style.userSelect = "none";
    }

    // Shows File 
    showFile(codeInput) {
        this.container.textContent = codeInput;
        hljs.highlightElement(this.container);
        convertTextToSpans(this.container.childNodes);
    }

    showLoadedFile(codeInput) {
        this.container.innerHTML = codeInput;
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

        this.clearMarkings(mark);

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

    //assigns a data-property to the new markings
    assignNewMarkings(id) {
        let newMarkings = document.querySelectorAll("mark");
        if (newMarkings) {
            for (let i = 0; i < newMarkings.length; i++) {
                if (!newMarkings[i].hasAttribute("data-id")) {
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
            `mark[data-id="${id}"]`);
        markings.forEach(el => {
            let innerEls = [];
            // To keep text nodes, this is a kind of work around instead of 
            // replace with el.childNodes directly 
            el.childNodes.forEach(node => {
                let el = node;
                innerEls.push(el);
            });
            replaceElement(el, innerEls);
            
        });
    }

    //removes markings that aren't connected to a voice recording
    removeUnconnectedMarkings() {
        let markings = document.querySelectorAll("mark");
        markings.forEach(el => {
            if (!el.hasAttribute("data-id")) {
                let innerEls = [];
                el.childNodes.forEach(node => {
                    let el = node;
                    innerEls.push(el);
                });
                replaceElement(el, innerEls);
            }
        });
    }

    hideMarking(id) {
        let markings = document.querySelectorAll(
            `mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking");
        });
    }

    highlightMarking(id) {
        let markings = document.querySelectorAll(
            `mark[data-id="${id}"]`);
        markings.forEach(el => {
            if (!el.classList.contains("marking-highlight-play")) {
                el.classList.add("marking-highlight");
            }
            el.classList.remove("marking");
        });
    }

    resetMarking(id) {
        let markings = document.querySelectorAll(
            `mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.remove("marking-highlight");
            if (!el.classList.contains("marking-highlight-play")) {
                el.classList.add("marking");
            }
        });
    }

    highlightPlayMarking(id) {
        let markings = document.querySelectorAll(`mark[data-id="${id}"]`);
        markings.forEach(el => {
            el.classList.add("marking-highlight-play");
            el.classList.remove("marking");
        });
        if(markings.length > 0){
            // Scrolls to a highlighted marking
            markings[0].scrollIntoView({
            block: "center",
            behavior: "smooth",
            });
        }
    }

    resetPlayMarking(id) {
        let markings = document.querySelectorAll(`mark[data-id="${id}"]`);
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
        // May not be necessary after change to Syntax Highlighting, but do not want to mess it up 
        if (mark.previousSibling.nodeType === Node.TEXT_NODE) {
            range.setStart(mark.previousSibling, 0);
            range.setEnd(mark, 0);
            textContent = range.extractContents();
            textEl.appendChild(textContent);
            range.insertNode(textEl);
            emptyMark = textEl.querySelector("mark");
            emptyMark.parentElement.removeChild(emptyMark);
        }
        this.removeInnerMarks();
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
                let innerEls = [];
                el.childNodes.forEach(node => {
                    let el = node;
                    innerEls.push(el);
                });
                replaceElement(el, innerEls);
            });
        });

        elements = document.querySelector(".main-right-code-container").childNodes;
        prevEl = elements[0];
        //connect two consecutive mark elements to one
        for (let i = 1; i < elements.length; i++) {
            if (prevEl.tagName === "MARK" && elements[i].tagName === "MARK") {
                // if() check for previous id and connect only when id is same and then give new mark the same id
                if (prevEl.getAttribute("data-id") === elements[i].getAttribute("data-id")) {
                    let newMark = document.createElement("mark");
                    newMark.classList.add("marking");
                    if (prevEl.getAttribute("data-id")) {
                        newMark.setAttribute("data-id", prevEl.getAttribute("data-id"));
                    }
                    newMark.innerHTML = prevEl.innerHTML + elements[i].innerHTML;
                    prevEl.parentNode.insertBefore(newMark, prevEl);
                    prevEl.parentNode.removeChild(prevEl);
                    elements[i].parentNode.removeChild(elements[i]);
                    i -= 1;
                    prevEl = elements[i];
                }
            } else {
                prevEl = elements[i];
            }
        }
        markings = document.querySelectorAll(".main-right-code-container > mark");
        for(let mark of markings){
            connectSpans(mark);
        }    
    }

    // Because of the structure of highlighted code (many spans), marks in a span cause bugs.
    // This function splits spans which are parent of a mark into many parts.
    removeInnerMarks(){
        let marksIn;
        marksIn = document.querySelectorAll("span > mark");
        marksIn.forEach(mark => {
            let parentCopy = document.createElement("span"),
                classlist = mark.parentNode.classList,
                newElements = [];
                parentCopy.innerHTML = mark.parentNode.innerHTML;
                
                parentCopy.childNodes.forEach(node => {
                    let el = node;
                    if(node.nodeType === Node.TEXT_NODE){
                        el = document.createElement("span");
                        el.innerHTML = node.data;
                    }
                    if(el.tagName !== "MARK"){
                        if(el.classList.length === 0 && classlist.length !== 0){
                            el.classList = classlist;
                        }
                        
                    }else{
                        let inner = el.innerHTML,
                        newInner = document.createElement("span");
                        newInner.innerHTML = inner;
                        if(classlist.length !== 0){
                            newInner.classList = classlist;
                        }
                        el.innerHTML = "";
                        el.appendChild(newInner);
                    }
                    newElements.push(el);
                });

                replaceElement(mark.parentNode, newElements);
            
        });
    }

    getHTML() {
        this.removeUnconnectedMarkings();
        return this.container.innerHTML;
    }
}

// Replaces a node with a list of nodes
function replaceElement(elementRep, list){
    for(let el of list){
        elementRep.parentNode.insertBefore(el, elementRep);
    }
    elementRep.parentNode.removeChild(elementRep);
}

// Connects two spans with the same classes
function connectSpans(mark){
    let elements = mark.childNodes,
        prevEl = elements[0];
        for (let i = 1; i < elements.length; i++) {
            if (prevEl.tagName === "SPAN" && elements[i].tagName === "SPAN") {
                // How to compare two arrays, retrieved from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript on 10.04.22
                if (compareClassLists(Array.from(prevEl.classList),Array.from(elements[i].classList))) {
                    let newSpan = document.createElement("span");
                    newSpan.classList = prevEl.classList;
                    newSpan.innerHTML = prevEl.innerHTML + elements[i].innerHTML;
                    prevEl.parentNode.insertBefore(newSpan, prevEl);
                    prevEl.parentNode.removeChild(prevEl);
                    elements[i].parentNode.removeChild(elements[i]);
                    i -=1;
                    prevEl = elements[i];
                } else {
                    prevEl = elements[i];
                }
            } else {
                prevEl = elements[i];
            }
            
        }
}

// Converts text nodes into spans, as those are a possible bug source
function convertTextToSpans(nodes){
    for (let node of nodes){
        if(node.nodeType === Node.TEXT_NODE){
            let span = document.createElement("span");
            span.innerText = node.data;
            node.replaceWith(span);
        }
    
    }
}

// Compares two class lists for equality
function compareClassLists(list1, list2){
    if(list1.length !== list2.length || list1.length === 0){
        return false;
    }
    for(let i = 0; i < list1.length; i++){
        if(list1[i] !== list2[i]){
            return false;
        }
    }
    return true;
}

export default CodeView;