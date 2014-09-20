Game.gameAttributes = function(publicity, hardcore, gameplay, userList, gameID) {
	this._publicity = publicity;
	this._hardcore = hardcore;
	this._gameplay = gameplay;
	this._userList = userList;
	this._gameID = gameID;
}

Game.gameAttributes.prototype.getPublicity = function() {
	return this._publicity;
};

Game.gameAttributes.prototype.getHardcore = function() {
	return this._hardcore;
}

Game.gameAttributes.prototype.getGameplay = function() {
	return this._gameplay;
}

Game.gameAttributes.prototype.getUserList = function() {
	return this._userList;
}

Game.gameAttributes.prototype.getGameID = function() {
	return this._gameID;
}

Game.gameAttributes.prototype.addUser = function(user) {
	this._userList.push(user);
}

Game.gameAttributes.prototype.removeUser = function(user) {
	index = users.indexOf(user);
	this._userList.splice(index, 1);	
}
