var sendMail = require ('./emailer');
var fs = require('fs');

const certPath = "C:/Certbot/live/moh.metratek.co.uk"

var options = {
  key: fs.readFileSync(certPath+'/privkey.pem'),
  cert: fs.readFileSync(certPath+'/fullchain.pem'),
	// Set CORS headers
  
  cookie: false
};


// we have to create one http and one https server
// to attach the socketio server, since with the simple
// listen method SSL is not possible
const httpServer = require('http').createServer(options);
var httpsServer = require('https').createServer(options);
var ioserver = require('socket.io')();

//var ioserver = new ioServer();
ioserver.attach(httpServer,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
ioserver.attach(httpsServer,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
httpServer.listen(3000);
httpsServer.listen(3001);



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