const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { socketConnection } = require('./handler/socketHandler')

app.use(cors);

const server = http.createServer(app).listen("8080", ()=>{
    console.log("Server connect to port 8080")
});

socketConnection(server)