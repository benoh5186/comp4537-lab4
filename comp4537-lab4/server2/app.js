const http = require("http");
const url = require("url");
const fs = require("fs");

class Server {
    constructor(port) {
        this.port = port
        this.server = http.createServer(
            (req, res) => {
                API.handleRequest(req, res);
            }
        )
    }
    start() {
        this.server.listen(this.port)
    }
}

class API {

    static handleRequest(req, res) {
    }

}