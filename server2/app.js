import { UserInterfaceString, Endpoints } from './lang/en/en.js';
import http from 'http';
import url from 'url';
import mysql2 from 'mysql2'

const FRONT_END_SERVER_DOMAIN = 'https://gilded-fairy-af2f9b.netlify.app'
const DEFAULT_PORT = 8000

/**
 * Represents a backend server.
 */
class Server {

    /**
     * Constructs an object.
     * @param {*} port 
     */
    constructor(port, db) {
        this.port = port
        this.db = db
        this.server = http.createServer(
            (req, res) => {
                res.setHeader('Access-Control-Allow-Origin', FRONT_END_SERVER_DOMAIN)
                res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
                API.handleRequest(req, res, this.db);
            }
        )
    }

    /**
     * Starts server and adds connection to the database instance;
     */
    start() {
        this.server.listen(this.port, async () => {
            await this.db.connect();
        })
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
    static async handleRequest(req, res, db) {
        const method = req.method 
        if(method === "POST") {
            await this.handlePostRequest(req, res, db)
        } else if (method === "GET"){
            await this.handleGetRequest(req, res, db)
            }
         else {
            res.writeHead(404, "application/json")
            res.write(JSON.stringify({error : UserInterfaceString.INCORRECT_ENDPOINT_MSG}))
            res.end()
        }
    }

    /**
     * Handles get request and SELECT queries.
     * If SELECT query is successful, rows data is written to the response in json with status code 200.
     * if no such data is found in the database or the query is invalid, status code is 400 with an error message
     * @param {*} req 
     * @param {*} res 
     */
    static async handleGetRequest(req, res, db) {
        const query = url.parse(req.url, true).query["query"]
        try {
            const result = await db.select(query)
            if (result.length > 0) {
                res.writeHead(200, {"Content-type": "application/json"})
                res.write(JSON.stringify({result : result}))
                res.end()
            } else {
                res.writeHead(400, {"Content-type" : "application/json"})
                res.write(JSON.stringify({error : UserInterfaceString.UNSUCCESSFUL_QUERY}))
                res.end()
            }
        }
        catch(err) {
            res.writeHead(400, {"Content-type" : "application/json"})
            res.write(JSON.stringify({error : err.message}))
            res.end()
        }
    }

    /**
     * Handles post request and INSERT queries.
     * if the query is invalid, status code is 400 with an error message
     * @param {*} req 
     * @param {*} res 
     */
    static async handlePostRequest(req, res, db) {
        try{
            const body = await API.getRequestBody(req);
            const data = JSON.parse(body)
            const result = await db.insert(data.query)
            res.writeHead(200, {"Content-Type" : "application/json"})
            res.write(JSON.stringify({result : result}))
            res.end()}

        catch(err){
            res.writeHead(400, {"Content-Type" : "application/json"})
            res.write(JSON.stringify({error : err.message}))
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




class Database {

    constructor() {
        this.connection = null;
        this.tableCreated = false
    }

    async connect() {
        this.connection = await mysql2.createConnection({
            host: "maglev.proxy.rlwy.net",
            port: 19615,
            user: "root",
            password: "lTmuaNaOuThjMFoKkjzmDHMurzUrmJUE",
            database: "railway"
        });
    }

    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS patient (
                patientId INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                dateOfBirth DATETIME NOT NULL
            ) ENGINE=InnoDB;
        `;
        await this.connection.query(query);
        this.tableCreated = true;
    }

    /**
     * Handles INSERT query
     * if the query is unsuccessful, it throws an exception(by the .query method)
     * @param {*} query 
     * @returns 
    */
    async insert(query) {
        if (!this.tableCreated) {
            await this.createTable();
        }
        const[result] = await this.connection.query(query);
        return result.affectedRows
    }

    /**
     * Handles SELECT query
     * if the query is unsuccessful, it throws an exception(by the .query method)
     * @param {*} query 
     * @returns 
     */
    async select(query) {
        if (!this.tableCreated) {
            await this.createTable();
        }
        const [rows] = await this.connection.query(query);
        return rows;
    }
    async close() {
        if (this.connection) {
            await this.connection.end();
        }
    }
}


const db = new Database();
let s = new Server(process.env.PORT || DEFAULT_PORT, db)
s.start()