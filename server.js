const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
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
    socket.on('disconnect',()=>{
      delete users[socket.user];
        io.emit('online users', users);
    })  
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));