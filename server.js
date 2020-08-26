const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { v4: uuidV4 } = require('uuid')
app.get('/',(req, res) =>{
  res.sendFile(__dirname +'/index.html');
});
var users ={};
var conversation = [];

io.on('connection', (socket) => {
  
    socket.on('chat message', (data) => {
     convo = {
       A: data.sender,
       B:data.receiver,
       msg : data.msg
     }
     
     conversation.push(convo);
        io.to(users[data.receiver]).to(users[data.sender]).emit('new message', convo,data.sender,data.receiver);
      });
      socket.on('prevchat', function(data) {
        io.to(users[data.sender]).emit('currchat', data.sender,data.receiver,conversation);
      });
    socket.on('new user', function(data){
        socket.user = data;
        users[socket.user] =socket.id;
        io.sockets.emit('online users',users);
    }); 
    socket.on('video-request',(data) =>{
      var room = uuidV4();
      console.log(room)
      io.to(users[data.receiver]).to(users[data.sender]).emit('answer',data,room);
    })
    socket.on('join-room',(roomId,userId) => {
      socket.join(roomId)
      console.log(socket.user + " connected " + roomId + " userid "+ userId);
      socket.to(roomId).broadcast.emit('user-connected', userId)
  })
    socket.on('disconnect',()=>{
      
      for(var i=0;i<conversation.length;i++){
        if((conversation[i].A === socket.user) ||(conversation[i].B === socket.user)){
          delete conversation[i].msg;
        }
      }
      delete users[socket.user];
      //socket.to(roomId).broadcast.emit('user-disconnected', userId)
      io.emit('online users', users);
    })  
  });

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));