const express = require('express');
require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {addUser,removeUser,getUser,getUsersInRoom} = require('./users.js');

const messageUtils = (message,username)=>{
	return {
		username,
		message,
		time:new Date().getTime()
	}
};

io.on('connection',(socket)=>{
	socket.on('join',({username,roomid},callback)=>{	
		const {error,user} = addUser({id:socket.id,username,roomid});
		if(error){
			return callback(error);
		}
		socket.join(user.roomid);
		socket.emit('Welcome',messageUtils('Welcome new user','Chat-bot'));
		socket.broadcast.to(user.roomid).emit('getMessage',messageUtils(`${user.username} has  joined`,'Chat-bot'));
		io.to(user.roomid).emit('getUsers',{
			roomName : user.roomid,
			users : getUsersInRoom({roomid:user.roomid})
		});
	});

	socket.on('sendMessage',(message,callback)=>{
		const {user} = getUser({id:socket.id});
		if(user){
			io.to(user.roomid).emit('getMessage',messageUtils(message,user.username));
			callback('Delivered');
		}
	});

	socket.on('location',(position,callback)=>{
		const {user} = getUser({id:socket.id});
		if(user){
			io.to(user.roomid).emit('locationMessage',messageUtils(`https://google.com/maps?q=${position.latitude},${position.longitude}`,user.username));
			callback();
		}
	});

	socket.on('signout',()=>{
		const {user} = removeUser({id:socket.id});
		if(user){
			io.to(user.roomid).emit('getMessage',messageUtils(`${user.username} has left!`,'Chat-bot'));
			io.to(user.roomid).emit('getUsers',{
				roomName : user.roomid,
				users : getUsersInRoom({roomid:user.roomid})
			});
		}
	});

	socket.on('disconnect',()=>{
		const {user} = removeUser({id:socket.id});
		if(user){
			io.to(user.roomid).emit('getMessage',messageUtils(`${user.username} has left!`,'Chat-bot'));
			io.to(user.roomid).emit('getUsers',{
				roomName : user.roomid,
				users : getUsersInRoom({roomid:user.roomid})
			});
		}
	})
});

server.listen(process.env.PORT||2000,()=>{
	console.log('The server is up!');
});