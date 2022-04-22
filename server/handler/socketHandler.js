const { Server, socket } = require('socket.io');

exports.socketConnection = (server) =>{
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: "*",
        },
    });

    const namespace = io.of('/chat')

    namespace.on("connection", (socket) => {
        console.log("socket connect to server");

        socket.on("JOIN_ROOM", (room)=>{
            if(room.lastRoom){
                // console.log("user leave "+ room.lastRoom+" and join "+room.currentRoom);
                socket.leave(room.lastRoom);

                const isRoomAvailable = socket.nsp.adapter.room.get(room.lastRoom);
                if(isRoomAvailable){
                    const userOnlineinRoom = socket.nsp.adapter.rooms.get(room.lastRoom).size.toString();
                    socket.nsp.to(room.lastRoom).emit("USERS_LEFT_IN_ROOM", userOnlineinRoom);
                }
            }
            // console.log("ROOM", room);
            socket.join(room.currentRoom);
            // GET DATA CHAT TO DATABASE
            // socket.nsp.to(room).emit("RECIEVE_MESSAGE" , dataMessage)

            const userOnlineinRoom = socket.nsp.adapter.rooms.get(room.currentRoom).size.toString();
            console.log(userOnlineinRoom);
            socket.nsp.to(room.currentRoom).emit("RECIEVE_USERS_ONLINE_IN_ROOM", userOnlineinRoom);
            // console.log("User with Id "+socket.id+" join to room "+room);
        })

        socket.on("SEND_MESSAGE", (dataMessage)=>{
            console.log("DATA_MESSAGE", dataMessage);
            // socket.broadcast.emit("RECIEVE_MESSAGE", dataMessage);
            // namespace.emit("RECIEVE_MESSAGE", dataMessage);
            socket.nsp.to(dataMessage.room).emit("RECIEVE_MESSAGE", dataMessage)
        });

        socket.on("IS_TYPING", (data)=>{
            socket.broadcast.to(data.room).emit("RECIEVE_TYPING", data.isTyping);
        })
    });
}