import {Validation} from "./utility.js"
import { UserInterfaceString } from "./lang/en/en.js" ;

document.getElementById("word-label").innerHTML = UserInterfaceString.STORE_PAGE_WORD_INPUT;
document.getElementById("definition-label").innerHTML = UserInterfaceString.STORE_PAGE_DEFINITION_INPUT;
document.getElementById("submit-button").innerHTML = UserInterfaceString.SUBMIT_BUTTON;

const incorrectInputColor = "red"
const form = document.getElementById("form");
const message = document.getElementById("message")
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const wordInput = document.getElementById("word")
    const definitionInput = document.getElementById("definition")
    if (Validation.validate(wordInput.value) && Validation.validate(definitionInput.value)) {
        const formInfo = {
            word : wordInput.value,
            definition : definitionInput.value
        }
        const response = await fetch(UserInterfaceString.SERVER_DOMAIN(), {
            method: "POST",
            headers: {
                    "Content-Type": "application/json" 
                },
            body:  JSON.stringify(formInfo)
        });
        if (response.ok) {
            const data = await response.json();
            if (data.wordExists) {
                message.innerHTML = UserInterfaceString.ALREADY_EXISTS(data.totalRequests, data.word);
            } else {
                message.innerHTML = UserInterfaceString.WORD_FOUND(data.totalRequests, data.dictLength)
            }
        }
    } else {
        if (!Validation.validate(wordInput.value)) {
            wordInput.style.borderColor = incorrectInputColor
        } if(!Validation.validate(definitionInput.value)) {
            definitionInput.style.borderColor = incorrectInputColor
        }

    }
})