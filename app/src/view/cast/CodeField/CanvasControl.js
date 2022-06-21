/* eslint-env browser */

import {Observable, Event} from "../../../utils/Observable.js";

class CanvasControl extends Observable{

    constructor(container){
        super();
        this.nextPageBtn = createNextPageButton();
        this.previousPageBtn = createPreviousPageButton();
        // this.zoomInBtn = createZoomInButton();
        // this.zoomOutBtn = createZoomOutButton();
        
        container.appendChild(this.nextPageBtn);
        container.appendChild(this.previousPageBtn);
        // container.appendChild(this.zoomInBtn);
        // container.appendChild(this.zoomOutBtn);

        this.nextPageBtn.addEventListener("click", this.nextPage.bind(this));
        this.previousPageBtn.addEventListener("click", this.previousPage.bind(this));
        // this.zoomInBtn.addEventListener("click", this.zoomInPage.bind(this));
        // this.zoomOutBtn.addEventListener("click", this.zoomOutPage.bind(this));
    }

    nextPage(){
        this.notifyAll(new Event("next-page", ""));
    }
    previousPage(){
        this.notifyAll(new Event("previous-page", ""));
    }

    zoomInPage(){
        this.notifyAll(new Event("zoomIn-page", ""));
    }

    zoomOutPage(){
        this.notifyAll(new Event("zoomOut-page", ""));
    }
}

function createZoomInButton(){
    let button = document.createElement("div");
    button.classList.add("fab-help");
    button.classList.add("zoomIn");
    button.innerHTML = "<img id='help-img' src='../../resources/icons/plus.svg'>";
    return button;
}

function createZoomOutButton(){
    let button = document.createElement("div");
    button.classList.add("fab-help");
    button.classList.add("zoomOut");
    button.innerHTML = "<img id='help-img' src='../../resources/icons/minus.svg'>";
    return button;
}

function createPreviousPageButton(){
    let button = document.createElement("div");
    button.classList.add("fab-help");
    button.classList.add("previousPage");
    button.innerHTML = "<img id='help-img' src='../../resources/icons/arrow-left.svg'>";
    return button;
}

function createNextPageButton(){
    let button = document.createElement("div");
    button.classList.add("fab-help");
    button.classList.add("nextPage");
    button.innerHTML = "<img id='help-img' src='../../resources/icons/arrow-right.svg'>";
    return button;
}

export default CanvasControl;