/**
 * Represents user interface strings for server 2.
 */
export class UserInterfaceString {
    static SEARCH_RESULT(requestCount, query) {
        return `Request# ${requestCount}, word '${query}' not found!`
    }
}