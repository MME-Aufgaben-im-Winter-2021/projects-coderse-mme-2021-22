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
        this.can = undefined;
        this.canvas = this.createCanvas();
        this.canvasModel = undefined;
        this.container.appendChild(this.canvas);
        this.pdfPages = [];
        
    }

    createCanvas(){
        let canvas = document.createElement("canvas");
        // canvas.id = "pdf-canvas";
        canvas.classList.add("main-right-canvas");
        this.showCanvas(canvas);
        return canvas;
      }

    getPDF(){
        this.safeCurrentPage();
        let data = {
            "pdf": this.pdf["_transport"]["_params"].url,
            "pages": this.pdfPages,
        };
        return data;
    }

    getImage(){
        let data = {
            "imageURL": this.pictureUrl,
            "lines": this.canvasModel.getLineArray(),
        };
        return data;
    }

    showCanvas(canvas){
        canvas.style.display = "block";
    }

    addCanvasControl(container){
        this.control = new CanvasControl(container);
        this.control.addEventListener("next-page", this.switchNextPage.bind(this));
        this.control.addEventListener("previous-page", this.switchPreviousPage.bind(this));
        // this.control.addEventListener("zoomIn-page", this.zoomInPage.bind(this));
        // this.control.addEventListener("zoomOut-page", this.zoomOutPage.bind(this));

    }

    safeCurrentPage(){
        this.pdfPages = this.pdfPages.filter(page => page.pageNum !== this.pageNum);
        let pageInfo = {
            "pageNum": this.pageNum,
            "elements": this.canvasModel.getElementArray(),
        };
        this.canvasModel.setElementArray([]);
        this.pdfPages.push(pageInfo);
    }

    switchNextPage(){
        this.safeCurrentPage();
        // TODO: bei maximaler Seite ausgrauen oder so
        this.pageNum += 1;
        this.showPdf().then(() => {
            this.drawCurrentPageElements();
        });
    }

    switchPreviousPage(){
        this.safeCurrentPage();
        this.pageNum -= 1;
        this.showPdf().then(() => {
            this.drawCurrentPageElements();
        });
    }

    drawCurrentPageElements(){
        let page = this.pdfPages.filter(page => page.pageNum === this.pageNum);
        this.canvasModel.drawPage(page);
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
        this.canvasModel = new Canvas(this.canvas);
    }

    showPicture(){
        let context = this.canvas.getContext("2d"),
        image = new Image();
        image.addEventListener("load", () => {
            this.canvas.width = image.naturalWidth;
            this.canvas.height = image.naturalHeight;
            context.drawImage(image,0,0,this.canvas.width,this.canvas.height);
            this.canvasModel = new Canvas(this.canvas);
        });
        image.src = this.pictureUrl;   
    }

}

export default CanvasView;