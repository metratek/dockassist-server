# dockassist-server
A node server application to support operation of the client dockassist app. It creates both a udp and a socket.io server.

## The udp server functionality
It listens for udp datagrams coming from the primary dockassist server. The datagrams include raw AIS sentences and berthing data (transmitted only if a berthing/unberthing operation is taking place). The udp server processes only the berthing data that is the datagrams starting with $DBD$.

author: asak
