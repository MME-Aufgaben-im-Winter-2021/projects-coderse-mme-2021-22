/* eslint-env browser */
import PlayerEntry from './PlayerEntryView.js';

// Class for the Audio Player in Code Cast Edit screen
class Player {

  constructor() {
    // The list element from the html-doc
    this.list = document.querySelector(".player-list");
  }

  // Add a Entry (A new Audio) to the list
  addEntry(name, time) {
    let entry = new PlayerEntry(name, time);
    entry.addEventListener("entry-delete", this.deleteEntry.bind(this));
    this.list.appendChild(entry.getNode());
  }

  // Delete a certain entry from the list with the event target
  // (Possible point which can be used with an Event on a Player Entry)
  deleteEntry(event) {
    let entry = event.data;
    this.list.removeChild(entry);
  }

}

export default Player;