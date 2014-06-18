Game.List = function(itemList, startX, startY) {
	this.itemList = itemList;
	this._startX = startX;
	this._startY = startY;
	this._currentIndex = 0;
}


Game.List.prototype.moveDown = function() {
	if (this._currentIndex < this.itemList.length) {
		this._currentIndex += 1;
	}
	this.render();
}

Game.List.prototype.moveUp = function() {
	if(this._currentIndex > 0) {
		this._currentIndex -= 1;
	}
	this.render();
}

Game.List.prototype.insert = function(index, item) {
	if (typeof index === undefined) index = this.itemList.length;
	this.itemList.splice(index, 0, item);
	this.render();
}

Game.List.prototype.insertBeforeCursor = function(item) {
	this.itemList.splice(this._currentIndex, 0, item);
	this.render();
}

Game.List.prototype.removeAtCursor = function() {
	this.itemList.splice(this._currentIndex, 1, item);
	this.render();
}

Game.List.render = function() {
	display = Game.getDisplay();
	for (i=0; i<this.itemList.length; i++) {
		if (i == this._currentIndex) {
			display.drawText(this.startX, this.startY + i, Game.util.setOptionHighlight(this.itemList[i]));
		} else {
			display.drawText(this.startX, this.startY + i, this.itemList[i]);
		}
	}
}
