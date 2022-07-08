/*eslint-env browser */

/*
    Code usage is explained in source: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
    Basic functionality of drawing on a canvas was copied and developed to our needs. 
*/

var lineArray = [],
  indexLineArray = -1;

// Draws line between two points
function drawLine(ctx, xStart, yStart, xEnd, yEnd, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.rect(xStart, yStart, xEnd - xStart, yEnd - yStart);
  ctx.fill();
  console.log(ctx);
}

class Canvas {
  constructor(canvas) {
    this.canvasEl = canvas;
    this.canvasEl.addEventListener("mousemove", this.handleEvent.bind(this));
    this.canvasEl.addEventListener("mousedown", this.handleEvent.bind(this));
    this.canvasEl.addEventListener("mouseup", this.handleEvent.bind(this));
    this.canvasEl.addEventListener("mouseout", this.handleEvent.bind(this));
    this.widthFactor = this.canvasEl.width / parseInt(getComputedStyle(this
      .canvasEl).getPropertyValue("width"));
    this.heightFactor = this.canvasEl.height / parseInt(getComputedStyle(this
      .canvasEl).getPropertyValue("height"), 10);
    this.context = this.canvasEl.getContext("2d");

    // The state, which handles if the user is drawing
    this.isDrawing = false;
    this.newRect = false;
    this.x = 0;
    this.y = 0;
    this.context.lineWidth = 10 * this.widthFactor;
    this.context.fillStyle = "rgba(144, 219, 244, 0.2)";
    this.context.strokeStyle = "rgba(144, 219, 244, 0.2)";
    this.elementArray = [];
  }

  getElementArray(){
    return this.elementArray;
  }

  setElementArray(array){
    this.elementArray = array;
  }

  getLineArray(){
    return lineArray;
  }

  handleEvent(e) {
    switch (e.type) {
      case "mousemove":
          this.draw(e);
        break;
      case "mousedown":
        this.setStartPoint(e);
        break;
      case "mouseup":
        this.stopDrawing(e);
        break;
      case "mouseout":
        this.stopDrawing(e);
        break;
      default:
        break;
  }

}

  // Starts the drawing mechanism
  setStartPoint(e) {
    this.context.beginPath();
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDrawing = true;
  }

  // Updates while drawing/ mouse-movement
  draw(e) {
    if (this.isDrawing) {
      if(this.newRect){
        this.undoStroke();
      }
      
      drawLine(this.context, this.x * this.widthFactor, this.y * this
        .heightFactor, e.offsetX * this.widthFactor, e.offsetY * this
        .heightFactor, "rgba(144, 219, 244, 0.2)");
      lineArray.push(this.context.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height));
      indexLineArray += 1;
      this.newRect = true;
      // this.x = e.offsetX;
      // this.y = e.offsetY;
    }
  }

  // Resets values of drawing mechanism
  stopDrawing(e) {
    if (this.isDrawing) {
      this.draw(e);
      let element = {
        "xStart": this.x,
        "xEnd": e.offsetX,
        "yStart": this.y,
        "yEnd": e.offsetY,
      };
      this.elementArray.push(element);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
      this.newRect = false;
    }
  }

  // Code used from https://www.youtube.com/watch?v=wCwKkT1P7vY
  undoStroke() {
    if (indexLineArray > 0) {
      indexLineArray -= 1;
      lineArray.pop();
      this.context.putImageData(lineArray[indexLineArray], 0, 0);
    }
  }

  drawPage(page){
    let pageEl = page[0];
    if(pageEl !== undefined){
      
      let ctx = this.canvasEl.getContext("2d");
      ctx.putImageData(ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height));
      ctx.beginPath();
      console.log(ctx);
      console.log(pageEl);
      ctx.globalCompositeOperation="source-over";
      pageEl.elements.forEach(element => {
        ctx.fillStyle = "rgb(233, 3, 33)";
        ctx.rect(0, 0, 500, 500);
        ctx.fill();
      });
      // 0 is unten links? und alles hinter grafiken
      ctx.stroke(); 
      // console.log(element);
        // drawLine(this.context, element.xStart * this.widthFactor, element.yStart * this.heightFactor,
        //   element.xEnd * this.widthFactor,
        //   element.yEnd * this.heightFactor, "rgba(144, 219, 244, 1)");
    }
   
  }

}
export default Canvas;