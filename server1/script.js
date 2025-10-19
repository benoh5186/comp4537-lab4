import { UserInterfaceString } from "./lang/en/en.js"

const insertButton = document.getElementById("insert-button");
const submitQueryButton = document.getElementById("query-button");
const queryArea = document.getElementById("query-area");
const feedbackArea = document.getElementById("feedback")

insertButton.innerHTML = UserInterfaceString.INSERT_BUTTON;
submitQueryButton.innerHTML = UserInterfaceString.SUBMIT_QUERY_BUTTON;


insertButton.addEventListener("click", async () => {
    const query = `INSERT INTO patient (name, dateOfBirth) VALUES 
    ('Sara Brown', '1981-01-01'),
    ('John Smith', '1941-01-01'),
    ('Jack Ma', '1961-01-30'),
    ('Elon Musk', '1999-01-01')`;

    await QueryHandler.executeQuery(query)

})

submitQueryButton.addEventListener("click", async () => {
    const query = queryArea.value.trim()
    if (!query) {
        feedbackArea.innerHTML = UserInterfaceString.EMPTY_QUERY
        return
    }
    await QueryHandler.executeQuery(query)
})



class QueryHandler {
    static async executeQuery(query) {
        if(query.startsWith("SELECT")) {
            await QueryHandler.sendGetRequest(query)

        } else if (query.startsWith("INSERT")) {
            await QueryHandler.sendPostRequest(query)

        } else {
            feedbackArea.innerHTML = UserInterfaceString.INVALID_QUERY;
        }

    }

    static async sendGetRequest(query) {
        const encodedQuery = encodeURIComponent(query)
        const response = await fetch(`${UserInterfaceString.GET_DOMAIN}/?query=${encodedQuery}`)
        if (response.ok) {
            const data = await response.json();
            feedbackArea.textContent = UserInterfaceString.GET_SUCCESS(data);
        } else {
            const data = await response.json();
            feedbackArea.textContent = data.error;
        }
    }

    static async sendPostRequest(query) {
        const response = await fetch(UserInterfaceString.POST_DOMAIN, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({query: query})
        })
        if (response.ok) {
            const successInsertMessage = UserInterfaceString.POST_SUCCESS;
            feedbackArea.textContent = successInsertMessage;
        } else {
            const data = await response.json();
            feedbackArea.textContent = data.error;
        }

    }

}