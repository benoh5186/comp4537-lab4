import { Validation } from "./validation.js"

const search_input = document.querySelector("#search-input")
const search_btn = document.querySelector("#search-btn")
const search_result = document.querySelector("#search-result")

search_btn.addEventListener("click", () => {
    const search = search_input.value
    fetch('', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({ search })
    })
})

// console.log(Validation.validate(""));
// console.log(Validation.validate(1));
// console.log(Validation.validate("   ")); 
// console.log(Validation.validate());

