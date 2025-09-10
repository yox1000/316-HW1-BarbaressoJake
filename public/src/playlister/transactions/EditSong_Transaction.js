import { jsTPS_Transaction } from '../../jstps/index.js'

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, index, oldSongData, newSongData) {
        super();
        this.store = initStore;
        this.index = index;
        this.oldSongData = oldSongData; // {title, artist, year}
        this.newSongData = newSongData; // {title, artist, year}
    }

    doTransaction() {
    this.store.handleUpdateSong(
        this.index, 
        this.newSongData.title, 
        this.newSongData.artist, 
        this.newSongData.youTubeId, 
        this.newSongData.year
        );
    }

    undoTransaction() {
    this.store.handleUpdateSong(
        this.index, 
        this.oldSongData.title, 
        this.oldSongData.artist, 
        this.oldSongData.youTubeId, 
        this.oldSongData.year
        );
    }

    toString() {
        return `EditSong_Transaction: ${this.oldSongData.title} → ${this.newSongData.title}`;
    }
}
