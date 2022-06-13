/* eslint-env browser */

class CanvasView {

    constructor(){
        this.container = document.querySelector(".main-right-code-container");
        this.pdf = undefined;
        this.pageNum = 1;
    }

    createCanvas(){
        let canvas = document.createElement("canvas");
        // canvas.id = "pdf-canvas";
        canvas.classList.add("main-right-canvas");
        canvas.style.display = "block";
        return canvas;
    }

    setDocument(pdf){
        this.pdf = pdf;
    }

    async show(){
        try {
            let page = await this.pdf.getPage(this.pageNum);
            this.showPage(page);
        }
        catch(error) {
            console.log(error);
        }

    }

    async showPage(page){
        let canvas,  
            scale, 
            viewport, 
            renderContext;
        canvas = this.createCanvas();
        scale = 5;
        viewport = page.getViewport(scale);

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: viewport,
        };

        this.pageNum += 1;

        try {
             await page.render(renderContext);
             this.show();
        }
        catch(error) {
            console.log(error);
        }

        this.container.appendChild(canvas);

    }

}

export default CanvasView;