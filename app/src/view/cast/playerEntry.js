/* eslint-env browser */
const TEMPLATE = document.getElementById('player-template').innerHTML
  .trim();

// A single Entry for the Audio Player consisting of a time, a name and a audio file
class PlayerEntry {

  constructor(name, time) {
    this.view = this.createPlayerEntry();
    this.view.querySelector(".player-list-entry-title").innerHTML = name;
    this.view.querySelector(".player-list-entry-time").innerHTML = time;
  }

  // Creates a Entry by using the template from the html document
  createPlayerEntry() {
    let view = document.createElement("div");
    view.innerHTML = TEMPLATE;
    return view.firstChild;
  }

  // Plays the Audio of this Entry
  play() {
    console.log("AUDIO IS PLAYING");
  }

  // Returns the node of this element -> For list operations
  getNode() {
    return this.view;
  }

}

export default PlayerEntry;