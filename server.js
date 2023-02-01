const express = require('express');
const ws = require('ws');
const config = require('config');
const uuid = require('uuid').v4;
const path = require('path');

const PORT = process.env.PORT || config.get("PORT")
const WS_PORT = process.env.WS_PORT || config.get("WS_PORT")
const staticPath = path.join(__dirname, "client", "build")

const app = express()
app.use(express.static(staticPath))

app.listen(PORT, () => console.log(`Server start on http://localhost:${PORT}`))

// WS

const clients = {}
const rooms = {}

const wss = new ws.Server({ port: WS_PORT })

wss.on("connection", socket => {
    const id = uuid()
    clients[id] = socket
    console.log(`Connect ${id}`);

    socket.on("message", rawMessage => {
        const data = JSON.parse(rawMessage)

        switch (data?.type) {
            case "":
                
                break;
        
            default:
                break;
        }
    })

    socket.on("close", () => {
        delete clients[id]
        console.log(`Disconnect ${id}`);
    })
})