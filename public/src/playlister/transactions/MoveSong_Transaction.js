import { jsTPS_Transaction } from '../../jstps/index.js'

/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 */
export default class MoveSong_Transaction extends jsTPS_Transaction {
    /**
     * Initializes this object such that it can both do and undo the transaction
     * 
     * @param {PlaylisterModel} initModel The M in MVC for this app
     * @param {number} initIndex The index of where the song is to be created in the playlist
     * @param {PlaylistSongPrototype} initSong The created song.
     */
    constructor(initModel, initOldIndex, initNewIndex) {
        super();
        this.model = initModel;
        this.oldIndex = initOldIndex;
        this.newIndex = initNewIndex;
    }
    /**
     * Executed when this transaction is first done or redone.
     */
    doTransaction() {
        this.model.moveSong(this.oldIndex, this.newIndex);
    }

    /**
     * Executed when this transaction is undone.
     */
    undoTransaction() {
        this.model.moveSong(this.newIndex, this.oldIndex);
    }
}