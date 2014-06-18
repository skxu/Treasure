/*
* horizMax is an array holding the max horizontal elements -1 for each row
* the row is defined by the index -1 in the array.
* 
* vertMax is an integer that represents the max rows in the menu
*
* itemList is an array of arrays [[row0],[row1],[row2]...]
*
* //NOT IMPLEMENTED YET
* align is an optional string representing alignment
* options include left & center for now, with default being left
*/
Game.Menu = function(itemList, align) {
	this._align = (typeof align === "undefined") ? "left" : align;
	this._itemList = itemList;
	this._vertMax = itemList.length;
	this._horizMax = [];
	for (index=0; index<length; index++) {
		horizMax = itemList[index].length;
		this._hoirzMax[index] = horizMax;
	}
	this._currentHorizIndex = 0;
	this._currentVertIndex = 0;


	//replace these with constants later
	this._horizStart = 3;
	this._horizSpacing = 10;
	this._vertStart = 8;
	this._vertSpacing = 3;

	this._defaultHorizMax = 4;

}

/*
* optional index parameter
* if index given, returns the horizMax for that row
* otherwise returns the entire array
*/
Game.Menu.prototype.getHorizMax = function(index) {
	value = (typeof index === "undefined") ? this._horizMax : this._horizMax[index];
	return value;
}

Game.Menu.prototype.getVertMax = function() {
	return this._vertMax;
}

Game.Menu.prototype.getCurrentHoriz = function() {
	return this._currentHorizIndex;
}

Game.Menu.prototype.getCurrentVert = function() {
	return this._currentVertIndex;
}

Game.Menu.prototype.moveLeft = function() {
	if (this._currentHorizIndex > 0) {
		this._currentHorizIndex -= 1;
		//refresh render here
		this.render();
	}
}

Game.Menu.prototype.moveRight = function() {
	if (this._currentHorizIndex < this._horizMax[this._currentVertIndex]) {
		this._currentHorizIndex += 1;
		//refresh render here
		this.render();
	}
}

Game.Menu.prototype.moveDown = function() {
	if (this._currentVertIndex < this._vertMax) {
		this._currentVertIndex += 1;
		//move horizontal cursor to max if it's bigger than max
		if (this._currentHorizIndex > this._horizMax[this._currentVertIndex]) {
			this._currentHorizIndex = this._horizMax[this._currentVertIndex];
		}
		//refresh render here
		this.render();
	}
}

Game.Menu.prototype.moveUp = function() {
	if (this._currentVertIndex > 0) {
		this._currentVertIndex -= 1;
		//move horizontal cursor to max if it's bigger than max
		if (this._currentHorizIndex > this._horizMax[this._currentVertIndex]) {
			this._currentHorizIndex = this._horizMax[this._currentVertIndex];
		}
		//refresh render here
		this.render();
	}
}

Game.Menu.prototype.getItem = function(vert,horiz) {
	return this._itemList[vert][horiz];
}

Game.Menu.render = function() {
	display = Game.getDisplay();
	for (vertIndex=0; vertIndex<this._vertMax; vertIndex++) {
		for (horizIndex=0; horizIndex<this._horizMax[vertIndex]; horizIndex++) {
			//render all the items in itemList
			x = this._horizStart + (this._horizSpacing*horizIndex);
			y = this._vertStart + (this._vertSpacing*vertIndex);
			text = this.getItem(vertIndex,horizIndex);
			//if item is currently selected, render as highlight
			if ((vertIndex == this._currentVertIndex) && (horizIndex == this._currentHorizIndex)) {
				display.drawText(x, y, Game.util.setOptionHighlight(text));
			} else {
				display.drawText(x, y, text);
			}
		}
	}
}