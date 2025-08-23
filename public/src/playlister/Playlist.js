/**
 * The Playlist class is a simple data class that is used to represent
 * a playlist of songs. Note, Playlist HAS-A PlaylistSongPrototype, in fact
 * it has a whole playlist full of them (of course). Note that the PlaylistBuilder,
 * class employs the Builder Design Pattern and serves to build these objects. No
 * other code should construct these objects without the builder as it tracks id
 * playlist id numbers for the application.
 * 
 * @author McKilla Gorilla
 */
export default class Playlist {
    /**
     * Constructor that initializes a named playlist such that it has an empty list of songs.
     * 
     * @param {number} initId Id number to use for initializing this playlist.
     */
    constructor(initId) {
        this.id = initId;
        this.songs = [];
        this.songCounter = 0;
    }

    /**
     * Accessor for getting the name of this playlist.
     * 
     * @returns The name of this playlist.
     */
    getName() {
        return this.name;
    }

    /**
     * Accessor for getting the song at index in the playlist nothing that the first song
     * in the playlist is at index 0.
     * 
     * @param {number} index The index in the playlist for the song to retrieve.
     * @returns The PlaylistSongPrototype object at index in the playlist.
     */
    getSongAt(index) {
        return this.songs[index];
    }

    /**
     * Mutator method for moving the song at one index to another without losing any songs. It
     * effectively works as a removal from one index and then an insert at another.
     * 
     * @param {number} oldIndex Index of where the song to be moved is located.
     * @param {number} newIndex Index of where to move the song.
     */
    moveSong(oldIndex, newIndex) {
        this.songs.splice(newIndex, 0, this.songs.splice(oldIndex, 1)[0]);
    }

    /**
     * Mutator method for changing the name of this playlist.
     * 
     * @param {string} initName The new playlist name.
     */
    setName(initName) {
        this.name = initName;
    }

    /**
     * Mutator method for setting a song at a specific playlist. The method must be
     * provided a valid instantiated song object./
     * 
     * @param {number} index Location in the playlist to put the song, with 0 being the first index.
     * @param {PlaylistSongPrototype} song Song to put in the playlist at index.
     */
    setSongAt(index, song) {
        this.songs[index] = song;
    }

    /**
     * Mutator method for setting the entire array of songs in the playlist.
     * 
     * @param {PlaylistSongPrototype[]} initSongs Array of songs to set in the playlist.
     */
    setSongs(initSongs) {
        this.songs = initSongs;
    }
}