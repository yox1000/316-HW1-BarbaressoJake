/**
 * This class provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 */

import EditSong_Transaction from './transactions/EditSong_Transaction.js';

export default class PlaylisterController {
    constructor() { }

    /**
     * This function makes sure the event doesn't get propogated to other controls.
     */
    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }

    /**
     * This function defines the event handlers that will respond to interactions
     * with all the static user interface controls, meaning the controls that
     * exist in the original Web page. Note that additional handlers will need
     * to be initialized for the dynamically loaded content, like for controls
     * that are built as the user interface is interacted with.
     */
    registerStaticHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        this.registerEditToolbarHandlers();

        // SETUP THE MODAL HANDLERS
        this.registerModalHandlers();

        // ADD PLAYLIST BUTTON HANDLER
        const addPlaylistButton = document.getElementById('add-playlist-button');
        if (addPlaylistButton) {
            addPlaylistButton.onclick = (event) => {
                this.addNewPlaylist();
            };
        }
        
    }

    /**
     * Specifies event handlers for buttons in the toolbar.
     */
    registerEditToolbarHandlers() {
        // HANDLER FOR ADDING A NEW SONG BUTTON
        document.getElementById("add-song-button").onmousedown = (event) => {
            this.model.addTransactionToCreateSong();
        }
        // HANDLER FOR UNDO BUTTON
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }
        // HANDLER FOR REDO BUTTON
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        // HANDLER FOR CLOSE LIST BUTTON
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unselectCurrentList();
        }
    }

    /**
     * Specifies event handlers for when confirm and cancel buttons
     * are pressed in the three modals.
     */
    registerModalHandlers() {
        // RESPOND TO THE USER CLOSING THE EDIT SONG MODAL VIA THE CANCEL BUTTON
        document.getElementById("edit-song-cancel-button").onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let editSongModal = document.getElementById("edit-song-modal");
            editSongModal.classList.remove("is-visible");

            //tabindex removed when modal closes
            if (editSongModal.hasAttribute && editSongModal.hasAttribute("tabindex")) {
                editSongModal.removeAttribute("tabindex");
            }
        }

        document.getElementById("edit-song-confirm-button").onclick = (event) => {
            this.handleUpdateSong();
        }

        // RESPOND TO THE USER CONFIRMING TO REMOVE A SONG
        document.getElementById("remove-song-confirm-button").onclick = (event) => {
            // GET THE SONG INDEX STORED IN THE MODEL WHEN OPENING THE MODAL
            let songIndex = this.model.getRemoveSongIndex();

            // ADD TRANSACTION TO REMOVE SONG
            this.model.addTransactionToRemoveSong(songIndex);

            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let removeSongModal = document.getElementById("remove-song-modal");
            removeSongModal.classList.remove("is-visible");

            //tabindex removed when modal closes
            if (removeSongModal.hasAttribute && removeSongModal.hasAttribute("tabindex")) {
                removeSongModal.removeAttribute("tabindex");
            }
        }

        // RESPOND TO THE USER CANCELING THE REMOVE SONG MODAL
        document.getElementById("remove-song-cancel-button").onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let removeSongModal = document.getElementById("remove-song-modal");
            removeSongModal.classList.remove("is-visible");

            //tabindex removed when modal closes
            if (removeSongModal.hasAttribute && removeSongModal.hasAttribute("tabindex")) {
                removeSongModal.removeAttribute("tabindex");
            }
        }

        // RESPOND TO THE USER CONFIRMING TO DELETE A PLAYLIST
        document.getElementById("delete-list-confirm-button").onclick = (event) => {
            // NOTE THAT WE SET THE ID OF THE LIST TO REMOVE
            // IN THE MODEL OBJECT AT THE TIME THE ORIGINAL
            // BUTTON PRESS EVENT HAPPENED
            let deleteListId = this.model.getDeleteListId();

            // DELETE THE LIST, THIS IS NOT UNDOABLE
            this.model.deleteList(deleteListId);

            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let deleteListModal = document.getElementById("delete-list-modal");
            deleteListModal.classList.remove("is-visible");

            // tabindex removed when modal closes
            if (deleteListModal.hasAttribute && deleteListModal.hasAttribute("tabindex")) {
                deleteListModal.removeAttribute("tabindex");
            }
        }

        // RESPOND TO THE USER CLOSING THE DELETE PLAYLIST MODAL
        document.getElementById("delete-list-cancel-button").onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let deleteListModal = document.getElementById("delete-list-modal");
            deleteListModal.classList.remove("is-visible");

            //tabindex removed when modal closes
            if (deleteListModal.hasAttribute && deleteListModal.hasAttribute("tabindex")) {
                deleteListModal.removeAttribute("tabindex");
            }
        }

        // Trigger confirm on Enter key for edit song modal
        const editSongModal = document.getElementById("edit-song-modal");
        editSongModal.addEventListener("keydown", (event) => {  
            if (event.key === "Enter") {
                event.preventDefault(); //Enter only runs custom handler
                document.getElementById("edit-song-confirm-button").click();
            } else if (event.key === "Escape") {
                event.preventDefault();
                document.getElementById("edit-song-cancel-button").click();
            }
        });

        // This listens on document and triggers confirm/cancel on enter/escape
        // when any modal is visible. Ensures even if focus is lost from modal
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== "Escape") return;

            // Check delete playlist modal first
            const deleteModal = document.getElementById("delete-list-modal");
            if (deleteModal && deleteModal.classList.contains("is-visible")) {
                event.preventDefault();
                if (event.key === "Enter") {
                    document.getElementById("delete-list-confirm-button").click();
                } else {
                    document.getElementById("delete-list-cancel-button").click();
                }
                return;
            }

            // Check remove song modal
            const removeModal = document.getElementById("remove-song-modal");
            if (removeModal && removeModal.classList.contains("is-visible")) {
                event.preventDefault();
                if (event.key === "Enter") {
                    document.getElementById("remove-song-confirm-button").click();
                } else {
                    document.getElementById("remove-song-cancel-button").click();
                }
                return;
            }

            // Check edit song modal (kept for completeness)
            const editModal = document.getElementById("edit-song-modal");
            if (editModal && editModal.classList.contains("is-visible")) {
                event.preventDefault();
                if (event.key === "Enter") {
                    document.getElementById("edit-song-confirm-button").click();
                } else {
                    document.getElementById("edit-song-cancel-button").click();
                }
                return;
            }
        });
    }

    /**
     * This function specifies event handling for interactions with a
     * list selection controls in the left toolbar. Note that we say these
     * are for dynamic controls because the items in the playlists list is
     * not known, it can be any number of items. It's as many items as there
     * are playlists, and users can add new playlists and delete playlists.
     * Note that the id provided must be the id of the playlist for which
     * to register event handling.
    */
    registerPlaylistCardHandlers(id) {
        // HANDLES SELECTING A PLAYLIST
        document.getElementById("playlist-card-" + id).onmousedown = (event) => {
            if (!this.model.isListNameBeingChanged()) {
                // MAKE SURE NOTHING OLD IS SELECTED
                this.model.unselectCurrentList();

                // GET THE SELECTED LIST
                this.model.loadList(id);
            }
        }
        // HANDLES DELETING A PLAYLIST
        document.getElementById("delete-list-button-" + id).onmousedown = (event) => {
            // DON'T PROPOGATE THIS INTERACTION TO LOWER-LEVEL CONTROLS
            this.ignoreParentClick(event);

            // RECORD THE ID OF THE LIST THE USER WISHES TO DELETE
            // SO THAT THE MODAL KNOWS WHICH ONE IT IS
            this.model.setDeleteListId(id);

            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE PLAYLIST
            // THE CODE BELOW OPENS UP THE LIST DELETE VERIFICATION DIALOG
            this.listToDeleteIndex = this.model.getListIndex(id);
            let listName = this.model.getList(this.listToDeleteIndex).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            let deleteListModal = document.getElementById("delete-list-modal");

            // OPEN UP THE DIALOG
            deleteListModal.classList.add("is-visible");
            this.model.toggleConfirmDialogOpen();

            // BLUR clicked button and force-focus the modal 
            // This prevents the button from keeping focus and stealing Enter.
            try {
                if (event && event.target && typeof event.target.blur === "function") event.target.blur();
            } catch(e) {}
            deleteListModal.setAttribute("tabindex", "-1");
            setTimeout(() => {
                try { deleteListModal.focus(); } catch(e){}
            }, 0);
        }
        // FOR RENAMING THE LIST NAME
        document.getElementById("playlist-card-" + id).ondblclick = (event) => {
            let text = document.getElementById("playlist-card-text-" + id)
            // CLEAR THE TEXT
            text.innerHTML = "";

            // SHOW THE TEXT FIELD
            this.model.setListNameBeingChanged(true, id);
            let textInput = document.getElementById("playlist-card-text-input-" + id);
            textInput.focus();
            textInput.value = this.model.getPlaylist(id).name;
        }

        // SPECIFY HANDLERS FOR THE TEXT FIELD
        let textInput = document.getElementById("playlist-card-text-input-" + id);
        textInput.ondblclick = (event) => {
            this.ignoreParentClick(event);
        }
        textInput.onkeydown = (event) => {
            if (event.key === 'Enter') {
                this.model.setListNameBeingChanged(false, id);
                this.model.renameCurrentList(event.target.value);//, id);
            }
        }
        textInput.onblur = (event) => {
            this.model.setListNameBeingChanged(false, id);
            this.model.renameCurrentList(event.target.value);//, id);
        }

        // HANDLES DUPLICATING A PLAYLIST
        const duplicateButton = document.getElementById("duplicate-playlist-button-" + id);
        if (duplicateButton) {
            duplicateButton.onclick = (event) => {
            this.ignoreParentClick(event); // prevent parent card selection when duplicating
            this.model.duplicateList(id);  // duplicate this specific playlist
            if (newPlaylist) this.model.selectList(newPlaylist); // select new card immediately
            };
        }
    }

    /**
     * This function specifies event handling for interactions with the playlist 
     * song cards. Note that we say these are for dynamic controls because the cards 
     * in the playlist are not known, it can be any number of songs. It's as many 
     * cards as there are songs in the playlist, and users can add and remove songs.
    */
    registerSongCardHandlers() {
        // SETUP THE HANDLERS FOR ALL SONG CARDS, WHICH ALL GET DONE
        // AT ONCE EVERY TIME DATA CHANGES, SINCE IT GETS REBUILT EACH TIME
        for (let i = 0; i < this.model.getPlaylistSize(); i++) {
            // GET THE CARD
            let card = document.getElementById("song-card-" + (i));

            // USER WANTS TO EDIT THE SONG
            card.ondblclick = (event) => {
                // DON'T PROPOGATE THE EVENT
                this.ignoreParentClick(event);

                // WE NEED TO RECORD THE INDEX FOR THE MODAL
                let songIndex = Number.parseInt(event.target.id.split("-")[2]);
                this.model.setEditSongIndex(songIndex);
                let song = this.model.getSong(songIndex);

                // LOAD THE SONG DATA INTO THE MODAL
                document.getElementById("edit-song-modal-title-textfield").value = song.title;
                document.getElementById("edit-song-modal-artist-textfield").value = song.artist;
                document.getElementById("edit-song-modal-youTubeId-textfield").value = song.youTubeId;
                document.getElementById("edit-song-modal-year-textfield").value = song.year;

                // OPEN UP THE MODAL
                let editSongModal = document.getElementById("edit-song-modal");
                editSongModal.classList.add("is-visible");

                // IGNORE ALL NON-MODAL EVENTS
                this.model.toggleConfirmDialogOpen();
            }

            // USER WANTS TO REMOVE A SONG FROM THE PLAYLIST
            let removeSongButton = card.querySelector(".remove-song-button");
            removeSongButton.onclick = (event) => {
                this.ignoreParentClick(event);

                let button = event.target;
                let songIndex = Number.parseInt(button.id.split("-")[2]);
                this.model.setRemoveSongIndex(songIndex);

                let song = this.model.getSong(songIndex);
                document.getElementById("remove-song-title-span").innerHTML = song.title;

                let removeSongModal = document.getElementById("remove-song-modal");
                removeSongModal.classList.add("is-visible");
                this.model.toggleConfirmDialogOpen();

                //ignore if doesnt have blur method 
                try {
                    if (button && typeof button.blur === "function") button.blur();
                } catch(e) {}
                removeSongModal.setAttribute("tabindex", "-1");
                setTimeout(() => {
                    try { removeSongModal.focus(); } catch(e) {}
                }, 0);
            }


            // NOW SETUP ALL CARD DRAGGING HANDLERS AS THE USER MAY WISH TO CHANGE
            // THE ORDER OF SONGS IN THE PLAYLIST

            // MAKE EACH CARD DRAGGABLE
            card.setAttribute('draggable', 'true')

            // WHEN DRAGGING STARTS RECORD THE INDEX
            card.ondragstart = (event) => {
                card.classList.add("is-dragging");
                event.dataTransfer.setData("from-id", i);
            }

            // WE ONLY WANT OUR CODE, NO DEFAULT BEHAVIOR FOR DRAGGING
            card.ondragover = (event) => {
                event.preventDefault();
            }

            // STOP THE DRAGGING LOOK WHEN IT'S NOT DRAGGING
            card.ondragend = (event) => {
                card.classList.remove("is-dragging");
            }

            // WHEN AN ITEM IS RELEASED WE NEED TO MOVE THE CARD
            card.ondrop = (event) => {
                event.preventDefault();
                // GET THE INDICES OF WHERE THE CARD IS BRING DRAGGED FROM AND TO
                let fromIndex = Number.parseInt(event.dataTransfer.getData("from-id"));
                let toIndex = Number.parseInt(event.target.id.split("-")[2]) - 1;

                // ONLY ADD A TRANSACTION IF THEY ARE NOT THE SAME
                // AND BOTH INDICES ARE VALID
                if ((fromIndex !== toIndex)
                    && !isNaN(fromIndex)
                    && !isNaN(toIndex)) {
                    this.model.addTransactionToMoveSong(fromIndex, toIndex);
                }
            }
        }
    }

    /**
     * We are using an MVC-type approach, so this controller class will respond by 
     * updating the application data, which is managed by the model class. So, this 
     * function registers the model object with this controller.
     */
    setModel(initModel) {
        this.model = initModel;
        this.registerStaticHandlers();
    }

    addNewPlaylist() {
    if (this.model) {
        // Asks model to add a new playlist called "Untitled"
        let newPlaylist = this.model.addNewList("Untitled", []);
        //Select the new playlist so user can start adding songs
        this.model.selectList(newPlaylist);
    }
    }

    handleUpdateSong () {
        let songIndex = this.model.getEditSongIndex();
        let newTitle = document.getElementById("edit-song-modal-title-textfield").value;
        let newArtist = document.getElementById("edit-song-modal-artist-textfield").value;
        let newYouTubeId = document.getElementById("edit-song-modal-youTubeId-textfield").value;
        let newYear = document.getElementById("edit-song-modal-year-textfield").value; 

        // Tell model to update song
        let oldSong = this.model.getSong(songIndex);
        let oldSongData = {
            title: oldSong.title,
            artist: oldSong.artist,
            youTubeId: oldSong.youTubeId,
            year: oldSong.year
        };

        let newSongData = {
            title: newTitle,
            artist: newArtist,
            youTubeId: newYouTubeId,
            year: newYear
        };

        // Create, add transaction
        let transaction = new EditSong_Transaction(this.model, songIndex, oldSongData, newSongData);
        this.model.tps.processTransaction(transaction);


        // Close modal
        let editSongModal = document.getElementById("edit-song-modal");
        editSongModal.classList.remove("is-visible");

        // Re-enable interactions
        this.model.toggleConfirmDialogOpen();

        if (editSongModal.hasAttribute && editSongModal.hasAttribute("tabindex")) {
            editSongModal.removeAttribute("tabindex");
        }
    }

}
