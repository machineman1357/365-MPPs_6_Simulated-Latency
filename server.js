var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);
app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

const sockets = {};
let packetId = 0;

io.on("connection", function (socket) {
    console.log("a user connected");
    sockets[socket.id] = socket;

    // when a player disconnects, remove them from our players object
    socket.on("disconnect", function () {
        console.log("user disconnected");
        // emit a message to all players to remove this player
        io.emit("disconnect", socket.id);
    });
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});

setInterval(() => {
    const firstPlayer = sockets[Object.keys(sockets)[0]];
    if(!firstPlayer) return;
    firstPlayer.emit("message", { packetId: packetId });
    packetId += 1;
}, 100);