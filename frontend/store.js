import {Validation} from "./utility.js"
const form = document.getElementById("form");
const message = document.getElementById("message")
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const wordInput = document.getElementById("word")
    const wordLabel = document.getElementById("word-label")
    const definitionLabel  = document.getElementById("definition-label")
    const definitionInput = document.getElementById("definition")
    if (Validation.validate(wordInput.value) && Validation.validate(definitionInput.value)) {
        const formInfo = {
            word : wordInput.value,
            definition : definitionInput.value
        }
        const response = await fetch("http://localhost:8000/definitions/", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json" 
                },
            body:  JSON.stringify(formInfo)
        });
        if (response.ok) {
            console.log("ok")
            const data = await response.json();
            message.innerHTML = data.message
            
        } else {
            console.log("nah")
        }
    } else {
        if (!Validation.validate(wordInput.value)) {
            wordInput.style.borderColor = "red"
            wordInput.innerHTML = "Please provide a word"
            wordInput.style.color = "red"
        } if(!Validation.validate(definitionInput.value)) {
            definitionInput.style.borderColor = "red"
            definitionInput.innerHTML = "Please provide a definition"
            definitionInput.style.color = "red"
        }

    }
})