/* eslint-env browser */

import Canvas from "./Canvas.js";
import CanvasControl from "./CanvasControl.js";

class CanvasView {

    constructor(){
        this.container = document.querySelector(".main-right-code-container");
        this.pdf = undefined;
        this.pageNum = 1;
        this.scale = 2;
        this.pictureUrl = undefined;
        this.canvas = this.createCanvas();
        this.container.appendChild(this.canvas);
        this.canvasModel = new Canvas(this.canvas);
    }

    getPDF(){
        let data = {
            "pdf": this.pdf["_transport"]["_params"].url,
            "lines": this.can.getLineArray(),
        };
        return data;
    }

    getImage(){
        let data = {
            "imageURL": this.pictureUrl,
            "lines": this.can.getLineArray(),
        };
        return data;
    }

    createCanvas(){
        let canvas = document.createElement("canvas");
        // canvas.id = "pdf-canvas";
        canvas.classList.add("main-right-canvas");
        return canvas;
    }

    showCanvas(){
        this.canvas.style.display = "block";
    }

    addCanvasControl(container){
        this.control = new CanvasControl(container);
        this.control.addEventListener("next-page", this.switchNextPage.bind(this));
        this.control.addEventListener("previous-page", this.switchPreviousPage.bind(this));
        // this.control.addEventListener("zoomIn-page", this.zoomInPage.bind(this));
        // this.control.addEventListener("zoomOut-page", this.zoomOutPage.bind(this));

    }

    switchNextPage(){
        // TODO: bei maximaler Seite ausgrauen oder so
        this.pageNum += 1;
        this.showPdf();
    }

    switchPreviousPage(){
        this.pageNum -= 1;
        this.showPdf();
    }

    // zoomInPage(){
    //     this.scale += 1;
    //     this.showPdf();
    // }

    // zoomOutPage(){
    //     this.scale -= 1;
    //     this.showPdf();
    // }

    setPictureUrl(url){
        this.pictureUrl = url;
    }

    setDocument(pdf){
        this.pdf = pdf;
    }

    async showPdf(){
        try {
            let page = await this.pdf.getPage(this.pageNum);
            this.showPage(page);
        }
        catch(error) {
            console.log(error);
        }

    }

    async showPage(page){
        let viewport, 
            renderContext;
        this.addCanvasControl(this.container);
        viewport = page.getViewport(this.scale);

        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;

        renderContext = {
            canvasContext: this.canvas.getContext("2d"),
            viewport: viewport,
        };

        await page.render(renderContext);
        this.showCanvas();
    }

    showPicture(){
        let context = this.canvas.getContext("2d"),
        image = new Image();
        image.addEventListener("load", () => {
            this.canvas.width = image.naturalWidth;
            this.canvas.height = image.naturalHeight;
            context.drawImage(image,0,0,this.canvas.width,this.canvas.height);
            this.showCanvas();
        });
        image.src = this.pictureUrl;   
    }

}

export default CanvasView;