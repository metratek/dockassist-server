var sendMail = require ('./emailer');
const
    io = require("socket.io"),
    ioserver = io.listen(3000);

const {
    log
} = require('./util/loggerTool')    

let sequenceNumberByClient = new Map();

// event fired every time a new client connects:
ioserver.on("connection", (iosocket) => {
    var address = iosocket.handshake.address.slice(7);
    console.info(`Client CONNECT [id=${iosocket.id}], ip=${address}`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(iosocket, 1);
    sendMail(`Client CONNECT ip=${address}, ${iosocket.handshake.headers['user-agent']}`);
    log("socket.io","info",`Client CONNECT [id=${iosocket.id}], ip=${address}`);

    // when socket disconnects, remove it from the list:
    iosocket.on("disconnect", () => {
        sequenceNumberByClient.delete(iosocket);
        sendMail(`Client DISCONNECT ip=${address}`);
        log("socket.io","info",`Client DISCONNECT [id=${iosocket.id}], ip=${address}`);
        console.info(`Client DISCONNECT [id=${iosocket.id}], ip=${address}`);
    });
});

// sends each client the current timestamp ---//its current sequence number
setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("timestamp", new Date().toJSON());
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 1000);

module.exports = ioserver;