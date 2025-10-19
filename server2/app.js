import { UserInterfaceString, Endpoints } from './lang/en/en.js';
import { Entry } from './entry.js';
import http from 'http';
import url from 'url';
import mysql2 from `mysql2`

const dictionary = []
const FRONT_END_SERVER_DOMAIN = 'https://gilded-fairy-af2f9b.netlify.app'
const DEFAULT_PORT = 8000
const db = mysql2.createConnection({
    host: "maglev.proxy.rlwy.net",
    port: 3306,
    user: "root",
    password: "lTmuaNaOuThjMFoKkjzmDHMurzUrmJUE",
    database: "railway"
}
)

let requestCount = 0;

/**
 * Represents a backend server.
 */
class Server {

    /**
     * Constructs an object.
     * @param {*} port 
     */
    constructor(port) {
        this.port = port
        this.server = http.createServer(
            (req, res) => {
                res.setHeader('Access-Control-Allow-Origin', FRONT_END_SERVER_DOMAIN)
                res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
                API.handleRequest(req, res);
            }
        )
    }

    /**
     * Starts server.
     */
    start() {
        this.server.listen(this.port)
    }
}


/**
 * Represents API.
 */
class API {

    /**
     * Handles reqeust.
     * @param {*} req 
     * @param {*} res 
     */
    static async handleRequest(req, res) {
        const q = url.parse(req.url, true)
        if(q.pathname === Endpoints.DEFINITIONS) {
            const method = req.method 
            if(method === "POST") {
                await this.handlePostRequest(req, res)
            } else {
                this.handleGetRequest(req, res)
            }
        } else {
            res.writeHead(404, "application/json")
            res.write(JSON.stringify({error : UserInterfaceString.INCORRECT_ENDPOINT_MSG}))
            res.end()
        }
    }

    /**
     * Handles get request.
     * Looks up definition of given word.
     * If there is a corresponding definition, provide it, otherwise error message.
     * @param {*} req 
     * @param {*} res 
     */
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

    /**
     * Handles post request.
     * Store word and definition.
     * If there is already definition stored, provide error message.
     * @param {*} req 
     * @param {*} res 
     */
    static async handlePostRequest(req, res) {
        try{
            requestCount += 1
            const body = await API.getRequestBody(req);
            const data = JSON.parse(body)
            const returnData = {word : data.word, totalRequests : requestCount, wordExists : false}
            dictionary.forEach(wordObject => {
                if (data.word === wordObject.getWord()) {
                    returnData.wordExists = true;
                }
            })
            if (!returnData.wordExists) {
                const wordObject = new Entry(data.word, data.definition)
                dictionary.push(wordObject)
                returnData.dictLength = dictionary.length 
            }
            res.writeHead(200, {"Content-Type" : "application/json"})
            res.write(JSON.stringify(returnData))
            res.end()}

        catch(error){
            console.error("Error:", error);
            res.writeHead(400, {"Content-Type" : "application/json"})
            res.write(JSON.stringify({error : UserInterfaceString.BAD_REQUEST_MSG}))
            res.end()
        }
    }

    /**
     * Gets request body.
     * @param {*} req 
     * @returns 
     */
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

let s = new Server(process.env.PORT || DEFAULT_PORT)
s.start()