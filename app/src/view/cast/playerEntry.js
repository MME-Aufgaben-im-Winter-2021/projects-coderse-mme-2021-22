/* eslint-env browser */
const TEMPLATE = document.getElementById('player-entry-template').innerHTML
  .trim();

class PlayerEntry {

  constructor() {
    this.view = this.createPlayerEntry();
  }

  createPlayerEntry() {
    let view = document.createElement("div");
    view.innerHTML = TEMPLATE;
    return view.firstChild;
  }

}

export default PlayerEntry;