const http = require("http");
const url = require("url");

let requestCount = 0;
const dictionary = []

class Server {
    constructor(port) {
        this.port = port
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

        // console.log(response);
        
        if(response) {
            res.writeHead(200, {"Content-type": "text/html"})
            res.end(response)
        } else {
            res.writeHead(200, {"Content-type": "text/html"})
            res.end(`Request# ${requestCount}, word '${query} not found!'`)
        }

    }



    static async handlePostRequest(req, res) {
        requestCount += 1
        try{
            const body = await API.getRequestBody(req);
            const data = JSON.parse(body)
            const word = data.word
            const definition = data.definition 
            const wordObject = new Entry(word, definition)
            const date = new Date().toDateString()
            let message =`$#${requestCount} updated on ${date}: there are ${storage.length} of entries in the dictionary`;
            storage.forEach(wordObject => {
                if (word === wordObject.getWord()) {
                    message = `Warning! ${word} already exists`

                }
            })
            storage.push(wordObject);
            const returnData = {message : message, totalRequests : requestCount}
            res.writeHead(200, {"Content-Type" : "application/json"})
            res.write(JSON.stringify(returnData))
            res.end()}

        catch(error){
            res.writeHead(400, {"Content-Type" : "application/json"})
            res.write(JSON.stringify({error : "Bad request"}))
            res.end()

        }


    }

    static getRequestBody(req) {
        return new Promise((resolve, reject) => {
            body = ""
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