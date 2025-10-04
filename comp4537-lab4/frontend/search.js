import { Validation } from "./validation.js"
import { UserInterfaceString } from "../lang/en/en.js"

const search_input = document.querySelector("#search-input")
const search_btn = document.querySelector("#search-btn")
const search_result = document.querySelector("#search-result")

search_btn.textContent = UserInterfaceString.SEARCH_BUTTON

search_btn.addEventListener("click", () => {
    const search = search_input.value
    if (Validation.validate(search))
    {
        fetch('', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ search })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
    }
})

// console.log(Validation.validate(""));
// console.log(Validation.validate(1));
// console.log(Validation.validate("   ")); 
// console.log(Validation.validate());

