/**
 * Represents user interface strings for server 1.
 */
export class UserInterfaceString {
    static INSERT_BUTTON = "Insert"

    static SUBMIT_QUERY_BUTTON = "Submit"

    static INVALID_QUERY = "Only SELECT or INSERT query allowed"

    static EMPTY_QUERY = "Please enter a query"

    static GET_DOMAIN = "https://comp4537-lab4-6ylr.onrender.com/GET"

    static POST_DOMAIN = "https://comp4537-lab4-6ylr.onrender.com/POST"

    static GET_SUCCESS(data) {
        let message = `Successfully retrieved:`;
        data.result.forEach( (row) => {
            message += `\n ${JSON.stringify(row)}`
        } )
        return message
    }

    static POST_SUCCESS = "Successfully inserted to the database"

}