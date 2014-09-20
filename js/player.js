var Player = function(x, y) {
	this._x = x;
	this._y = y;
	this._draw();
}

Player.prototype._draw = function() {
	Game.getDisplay().draw(this._x, this._y, "@", "#ff0");
}

Player.prototype._checkBox = function() {
	var key = this._x + "," + this._y;
	if (Game.map[key] != "*") {
		Game.getDisplay().draw(this._x, this._y - 2, "There is no chest here.");
	} else if (key == Game.treasure) {
		Game.getDisplay().draw(this._x, this._y - 2, "You found treasure.");
	} else {
		Game.getDisplay().draw(this._x, this._y - 2, "Nothing in this chest.");
	}
}

Player.prototype.act = function() {
	Game.engine.lock();
	//waiting for the user to input something
	//window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
	var keyMap = {};
	keyMap[ROT.VK_UP] = 0;
	keyMap[ROT.VK_RIGHT] = 1;
	keyMap[ROT.VK_LEFT] = 3;
	keyMap[ROT.VK_DOWN] = 2;

	var code = e.keyCode;
	if (code == ROT.VK_SPACE) {
		this._checkBox();
		return;
	}

	//Only take valid keys
	if (!(code in keyMap)) {
		return;
	}

	//Get the change in x, y after input
	var diff = ROT.DIRS[4][keyMap[code]];
	var newX = this._x + diff[0];
	var newY = this._y + diff[1];

	if (Game.Tile.wallTile == Game.currentMap.getTile(newX,newY)) {
		console.log("wallTile");
		return;
	}


	Game.getDisplay().draw(this._x, this._y, Game.map[this._x + ",", + this._y]);
	this._x = newX;
	this._y = newY;
	this._draw();
	window.removeEventListener("keydown", this);
	Game.engine.unlock();

}