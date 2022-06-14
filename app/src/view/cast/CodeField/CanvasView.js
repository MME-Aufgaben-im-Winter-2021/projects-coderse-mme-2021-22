/* eslint-env browser */

class CanvasView {

    constructor(){
        this.container = document.querySelector(".main-right-code-container");
        this.pdf = undefined;
        this.pageNum = 1;
        this.pictureUrl = undefined;
    }

    createCanvas(){
        let canvas = document.createElement("canvas");
        // canvas.id = "pdf-canvas";
        canvas.classList.add("main-right-canvas");
        canvas.style.display = "block";
        return canvas;
    }

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
        let canvas,  
            scale, 
            viewport, 
            renderContext;
        canvas = this.createCanvas();
        scale = 10;
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
             this.showPdf();
        }
        catch(error) {
            console.log(error);
        }

        this.container.appendChild(canvas);

    }

    showPicture(){
        let canvas = this.createCanvas(),
        context = canvas.getContext("2d"),
        image = new Image();
        this.container.appendChild(canvas);
        image.addEventListener("load", () => {
            canvas.width = image.naturalWidth;
            canvas.height = this.naturalHeight;
            context.drawImage(image,0,0,canvas.width,canvas.height);
        });
        image.src = this.pictureUrl;   
    }

}

export default CanvasView;