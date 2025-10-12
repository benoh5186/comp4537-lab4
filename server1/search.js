import { Validation } from "./utility.js"
import { UserInterfaceString } from "./lang/en/en.js"

const search_input = document.querySelector("#search-input")
const search_btn = document.querySelector("#search-btn")
const search_result = document.querySelector("#search-result")

search_btn.textContent = UserInterfaceString.SEARCH_BUTTON

search_btn.addEventListener("click", () => {
    const search = search_input.value
    
    if (Validation.validate(search))
    {
        
        fetch(`https://comp4537-lab4-6ylr.onrender.com/definitions/?word=${encodeURIComponent(search)}`, {
            method: 'GET',
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            
            search_result.textContent = data
        })
        .catch(error => console.error(error))
    }
})


