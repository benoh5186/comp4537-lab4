/**
 * Represents user interface strings for server 1.
 */
export class UserInterfaceString {
    static INSERT_BUTTON = "Insert"

    static SUBMIT_QUERY_BUTTON = "Submit"

    static INVALID_QUERY = "Only SELECT or INSERT query allowed"

    static EMPTY_QUERY = "Please enter a query"

    static GET_DOMAIN = "https://comp4537-lab4-6ylr.onrender.com/GET/"

    static POST_DOMAIN = "https://comp4537-lab4-6ylr.onrender.com/POST/"

    static GET_SUCCESS(data) {
        let message = `Successfully retrieved:`;
        data.result.forEach( (row) => {
            message += `\n ${JSON.stringify(row)}`
        } )
        return message
    }

    static POST_SUCCESS = "Successfully inserted to the database"







    static SEARCH_BUTTON = "Search"
    static SEARCH_RESULT(requestCount, query) {
        return `Request# ${requestCount}, word '${query}' not found!`
    }

    static ALREADY_EXISTS(requestCount, word) {
        return `Request #${requestCount}: Warning! ${word} already exists`
    }

    static WORD_FOUND(requestCount, dictLength) {
        const date = new Date().toDateString();
        return `Request #${requestCount} updated on ${date}: there are ${dictLength} entries in the dictionary!`
    }

    static SERVER_DOMAIN(query="") {
        if (query) {
            return `https://comp4537-lab4-6ylr.onrender.com/definitions/?word=${query}`
        }
        return `https://comp4537-lab4-6ylr.onrender.com/definitions/`
    }

    static STORE_PAGE_WORD_INPUT = "Type Word"

    static STORE_PAGE_DEFINITION_INPUT = "Type Definition"

    static SUBMIT_BUTTON =  "Submit"
}