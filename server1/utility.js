const STRING_TYPE = "string"
const EMPTY_STRING = ""

/** 
 * Represents validation class.
 */
export class Validation {

    /**
     * Validates argument.
     * @param {*} x 
     * @returns true if the argument is type of string and not blank. Otherwise false.
     */
    static validate(x) {
        return typeof x === STRING_TYPE && x.trim() !== EMPTY_STRING
    }
}