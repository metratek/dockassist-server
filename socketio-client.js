const
    io = require("socket.io-client"),
    ioClient = io.connect("https://moh.metratek.co.uk:3001");

ioClient.on("seq-num", (msg) => console.info(msg));
ioClient.on("timestamp", (msg) => console.info(msg));
ioClient.on("message", (msg) => console.info(msg));
