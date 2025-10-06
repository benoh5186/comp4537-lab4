import { UserInterfaceString } from './lang/en/en.js';
import http from 'http';
import url from 'url';

let requestCount = 0;
const dictionary = []

class Server {
    constructor(port) {
        this.port = port
        dictionary.push(new Entry("book", "book's definition"))
        dictionary.push(new Entry("apple", "apple's definition"))

        this.server = http.createServer(
            (req, res) => {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
                API.handleRequest(req, res);
            }
        )
    }
    start() {
        this.server.listen(this.port)
    }
}

class API {

    static async handleRequest(req, res) {
        const q = url.parse(req.url, true)
        if(q.pathname === "/definitions/") {
            const method = req.method 
            if(method === "POST") {
                await this.handlePostRequest(req, res)
            } else {
                this.handleGetRequest(req, res)
            }
        } else {
            res.writeHead(404, "application/json")
            res.write(JSON.stringify({error : "incorrect endpoint"}))
            res.end()
        }
    }


    static handleGetRequest(req, res) {
        requestCount += 1
        let response = null
        const query = url.parse(req.url, true).query["word"]

        dictionary.forEach((entry) => {
            if(entry.getWord() === query) {
                response = entry.getDefinition()
            }
        })

        if(response) {
            res.writeHead(200, {"Content-type": "text/html"})
            res.end(response)
        } else {
            res.writeHead(200, {"Content-type": "text/html"})
            res.end(UserInterfaceString.SEARCH_RESULT(requestCount, query))
        }
    }



    static async handlePostRequest(req, res) {
        requestCount += 1
        try{
            let wordExists = false
            const body = await API.getRequestBody(req);
            const data = JSON.parse(body)
            const wordObject = new Entry(data.word, data.definition)
            const date = new Date().toDateString()
            let message;
            dictionary.forEach(wordObject => {
                if (data.word === wordObject.getWord()) {
                    wordExists = true;
                }
            })
            if (wordExists) {
                message = `#${requestCount}: Warning! ${data.word} already exists`
            } else {
                dictionary.push(wordObject);
                message =`#${requestCount} updated on ${date}: there are ${dictionary.length} of entries in the dictionary`;
            }
            const returnData = {message : message, totalRequests : requestCount}
            res.writeHead(200, {"Content-Type" : "application/json"})
            res.write(JSON.stringify(returnData))
            res.end()}

        catch(error){
            console.error("Error:", error);
            res.writeHead(400, {"Content-Type" : "application/json"})
            res.write(JSON.stringify({error : "Bad request"}))
            res.end()

        }


    }

    static getRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = ""
            req.on("data", chunk => {
                body += chunk.toString()
            })
            req.on("end", () => {
                resolve(body)
            })
            req.on("error", reject)          
        })

    }

}

class Entry {
    constructor(word, definition) {
        this.word = word
        this.definition = definition
    }
    getWord() {
        return this.word 
    }
    getDefinition() {
        return this.definition 
    }
}

let s = new Server(8000)
s.start()