Game.Tile = function(glyph, type) {
	this._glyph = glyph;
	this._type = type;
};

Game.Tile.prototype.getGlyph = function() {
	return this._glyph;
}

//tile that is out of bounds
Game.Tile.nullTile = new Game.Tile(new Game.Glyph(), "null");

Game.Tile.floorTile = new Game.Tile(new Game.Glyph('.'), "floor");
Game.Tile.wallTile = new Game.Tile(new Game.Glyph('#', 'goldenrod'), "wall");