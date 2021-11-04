const ioserver = require('./socketio-server');


// Example adapted from https://gist.github.com/sid24rane/6e6698e93360f2694e310dd347a2e2eb
// https://gist.github.com/sid24rane

const udp = require('dgram')
const udp_conf = require('./config/udp-config')

const {
    log
} = require('./util/loggerTool')

// --------------------creating a udp server --------------------

// creating a udp server
const server = udp.createSocket('udp4')


// emits when any error occurs
server.on('error', (error) => {
    log("udp_server", "error", error)
    server.close()
})

// emits on new datagram msg
server.on('message', (msg,info) => {
    log("udp_server", "info", msg.toString() + ` | Received ${msg.length} bytes from ${info.address}:${info.port}`);

    let msgstr = msg.toString();

     if ( msgstr.substring(0,5) !== '$DBD$') {
            // forwards regular AIS messages to other service using UDP
           const data = Buffer.from(msg);
           server.send(data, udp_conf.forwardPort, udp_conf.forwardIP, (error, bytes) => {
               if(error){
                   log("udp_server", "error", error)
                  // client.close()
               } else {
                   log("udp_server", "info", `Forwarded to ${udp_conf.forwardIP}:${udp_conf.forwardPort}`);
               }    
           })  //end server.send  */            
    } else{
        const jsonstr = msgstr.substring(5, msgstr.length );
         
        // broadcast berthing data to connected websockets clients   
        
        console.log( JSON.parse(jsonstr));
        try {
        ioserver.sockets.emit('message', JSON.parse(jsonstr)); 
        } catch(e) {
            log("udp_server", "error", "Trying to emit berthing data to clients" + e) ;
        }
    }
   




})  // end server.on


//emits when socket is ready and listening for datagram msgs
server.on('listening', () => {
    const address = server.address()
    const port = address.port
    const family = address.family
    const ipaddr = address.address

    log("udp_server", "info", 'Server is listening at port ' + port)
    log("udp_server", "info", 'Server ip :' + ipaddr)
    log("udp_server", "info", 'Server is IP4/IP6 : ' + family)
})

//emits after the socket is closed using socket.close()
server.on('close', () => {
    log("udp_server", "info", 'Socket is closed !')
})

server.bind(udp_conf.port)