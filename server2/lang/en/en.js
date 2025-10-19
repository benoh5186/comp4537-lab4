/**
 * Represents user interface strings for server 2.
 */
export class UserInterfaceString {
    static SEARCH_RESULT(requestCount, query) {
        return `Request# ${requestCount}, word '${query}' not found!`
    }


    static ALREADY_EXISTS(requestCount, word) {
        return `Request #${requestCount}: Warning! ${word} already exists`
    }

    static WORD_FOUND(requestCount, dictLength) {
        const date = new Date().toDateString();
        return `Request #${requestCount} updated on ${date}: there are ${dictLength} of entries in the dictionary!`
    }

    static INCORRECT_ENDPOINT_MSG = "incorrect endpoint"
    static BAD_REQUEST_MSG = "Bad request"
    
}

export class Endpoints {
    static DEFINITIONS = "/definitions/"
    static GET = "/GET"
    static POST = "/POST"
}