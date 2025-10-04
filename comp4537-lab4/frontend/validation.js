export class Validation {
    static validate(x) {
        return typeof x === "string" && x.trim() !== ""
    }
}