/**
 * Represents user interface strings for server 1.
 */
export class UserInterfaceString {
    static SEARCH_BUTTON = "Search"
    static SEARCH_RESULT(requestCount, query) {
        return `Request# ${requestCount}, word '${query}' not found!`
    }





    static STORE_PAGE_WORD_INPUT = "Type Word"

    static STORE_PAGE_DEFINITION_INPUT = "Type Definition"

    static SUBMIT_BUTTON =  "Submit"
}