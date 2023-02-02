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

        console.log(data);

        switch (data?.type) {
            case "connect":
                clients[id].deviceType = data?.deviceType
                break;

            case "create":
                if (clients[id].deviceType !== "display") {
                    return console.log("room can only create user with type 'Display'");
                }
                if (rooms[id]) {
                    return console.log("You are already the owner of the room");
                }
                const newRoomCode = genRoomCode()

                send(id, { type: "successCreated", roomCode: newRoomCode })

                return rooms[id] = {
                    code: newRoomCode,
                    controllerId: null
                }

            case "join":

                const roomCode = data?.code || null

                if (clients[id].deviceType !== "controller") {
                    return console.log("room can only create user with type 'Display'");
                }

                const roomId = getRoomIdByRoomCode(roomCode)

                if (!roomId) {
                    return console.log(`Room with code '${roomCode}' does not exist`);
                }

                if (rooms[roomId].controllerId) {
                    return console.log("Someone’s already connected to this room");
                }

                rooms[roomId].controllerId = id
                clients[id].roomId = roomId
                send(roomId, { type: "successJoin", controllerId: id })
                send(id, { type: "successJoin", roomId })
                return;

            case "position":
                send(clients[id].roomId, data)
                break;

            default:
                break;
        }
    })

    socket.on("close", () => {
        delete clients[id]
        if (rooms[id]) {
            delete rooms[id]
        }
        console.log(`Disconnect ${id}`);
    })

    function genRoomCode() {
        let result = ""

        for (let i = 0; i <= 4; i++) {
            const num = Math.round(Math.random() * 9)
            result += num.toString()
        }

        if (getRoomIdByRoomCode(result)) {
            return genRoomCode()
        }

        return result
    }

    function getRoomIdByRoomCode(roomCode) {
        let result = null

        for (roomId in rooms) {
            const room = rooms[roomId]

            if (room.code === roomCode) {
                result = roomId
            }
        }

        return result
    }

    function send(id, message) {
        clients[id]?.send(JSON.stringify(message))
    }
})