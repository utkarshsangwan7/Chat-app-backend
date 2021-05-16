const users = [];

const addUser = ({id,username,roomid})=>{
	username = username.trim().toLowerCase();
	roomid = roomid.trim().toLowerCase();

	if(!username || !roomid){
		return {
			error:"Error the username or roomid is invalid!"
		}
	}

	const flag = users.find((user)=>{
		return user.roomid===roomid && user.username===username;
	});

	if(flag){
		return {
			error:"Error the username is already in use"
		}
	}
	const user = {id,username,roomid};
	users.push(user);
	return {user};
}

const removeUser = ({id})=>{
	const index =  users.findIndex((user)=>{
		return user.id===id;
	});

	if(index!==-1){
		const user = users.splice(index,1)[0]; 
		return {user};
	}else{
		return false;
	}
}

const getUser = ({id})=>{
	const user = users.find((user)=>{
		return user.id===id;
	});
	return {user};	
}

const getUsersInRoom = ({roomid})=>{
	roomid=roomid.trim().toLowerCase();
	const usersInRoom = users.filter((user)=>{
		return user.roomid===roomid;
	});
	return usersInRoom;
}

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
}