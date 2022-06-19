/*eslint-env browser */

/*
    Code usage is explained in source: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
    Basic functionality of drawing on a canvas was copied and developed to our needs. 
*/

var lineArray = [],
  indexLineArray = -1;

// Draws line between two points
function drawLine(ctx, xStart, yStart, xEnd, yEnd) {
  // ctx.moveTo(xStart, yStart);
  // ctx.lineTo(xEnd, yEnd);
  // ctx.stroke();
  // ctx.closePath();
  ctx.rect(xStart, yStart, xEnd - xStart, yEnd - yStart);
  ctx.fill();
}

class Canvas {
  constructor(canvasEl_) {
    this.canvasEl = canvasEl_;
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
    this.context.fillStyle = "rgba(144, 219, 244, 0.2)";
    this.context.strokeStyle = "rgba(144, 219, 244, 0.2)";
    this.context.lineWidth = 10 * this.widthFactor;
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
    this.context.moveTo(e.clientX - this.canvasEl.offsetLeft,
      e.clientY - this.canvasEl.offsetTop);
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
        .heightFactor);
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

}
export default Canvas;