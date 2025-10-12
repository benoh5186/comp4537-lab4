/**
 * Represent an entry.
 */
export class Entry {

    /**
     * Constructs an object.
     * @param {*} word 
     * @param {*} definition 
     */
    constructor(word, definition) {
        this.word = word
        this.definition = definition
    }
    
    /**
     * Gets word.
     * @returns word
     */
    getWord() {
        return this.word 
    }

    /**
     * Gets definition
     * @returns definition
     */
    getDefinition() {
        return this.definition 
    }
}