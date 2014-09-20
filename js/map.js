Game.Map = function(tiles) {
	this._tiles = tiles[1];
	this._freeCells = tiles[0]

	//cache width & height
	//based on tile dimensions
	this._width = tiles[1].length;
	this._height = tiles[1][0].length;
};

Game.Map.prototype.getWidth = function() {
	return this._width;
};

Game.Map.prototype.getHeight = function() {
	return this._height;
};

Game.Map.prototype.getTile = function(x, y) {
	//Check if in boundaries
	if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
		return Game.Tile.nullTile;
	} else {
		return this._tiles[x][y] || Game.Tile.nullTile;
	}
};

Game.Map.generateDungMap = function(width, height) {
	var map = [];
	var freeCells = [];

	for (var x=0; x<width; x++) {
		map.push([]);
		for (var y=0; y<height; y++) {
			map[x].push(Game.Tile.nullTile);
		}
	}


	var digger = new ROT.Map.Digger();
	var digCallback = function(x, y, value) {
		if (value) {
			map[x][y] = Game.Tile.wallTile; 
		} else {
			freeCells.push([x,y]);
			this.map[x][y] = Game.Tile.floorTile; //String.fromCharCode(183);
		}
	}
	digger.create(digCallback.bind(this));
	var mapList = [freeCells, map];
	mapList = this._generateBoxes(mapList);
	mapList = this._createPlayer(mapList);
	return mapList;
};

Game.Map.generateCellularMap = function(width, height, p, iter) {
	p = p || 0.5;
	iter = iter || 3;
	var map = [];
	var freeCells = [];
	for (var x=0; x<width; x++) {
		map.push([]);
		for (var y=0; y<height; y++) {
			map[x].push(Game.Tile.nullTile);
		}
	}

	var generator = new ROT.Map.Cellular(width,height);
	//cells with p probability (default 0.5)
	generator.randomize(p);

	//iterate the map generation for smoothness
	for (var i=0; i<iter-1; i++) {
		generator.create();
	}

	generator.create(function(x,y,value) {
		if (value === 1) {
			map[x][y] = Game.Tile.floorTile;
			freeCells.push([x,y]);
		} else {
			map[x][y] = Game.Tile.wallTile;
		}
	});
	var mapList = [freeCells, map];
	mapList = this._generateBoxes(mapList);
	mapList = this._createPlayer(mapList);
	//console.log(mapList);
	return mapList;

}


/**
 * mapList[0] contains freeCells[][]
 * mapList[1] contains the entire map[][]
 */
Game.Map._generateBoxes = function(mapList) {
	freeCells = mapList[0];
	map = mapList[1];
	for (var i=0; i<10; i++) {
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
		var key = freeCells.splice(index, 1)[0];
		var x = key[0];
		var y = key[1];
		map[x][y] = new Game.Tile(new Game.Glyph("*"));
	}
	return [freeCells, map];
};

Game.Map.drawWholeMap = function(map) {
	for (var x=0; x<map.getWidth(); x++) {
		for (var y=0; y<map.getHeight(); y++) {
			var glyph = map.getTile(x,y).getGlyph();
			Game.getDisplay().draw(x,y, glyph.getChar(), glyph.getForeground(), glyph.getBackground());
		}
	}
};


Game.Map._createPlayer = function(mapList) {
	freeCells = mapList[0];
	map = mapList[1];
	var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	var key = freeCells.splice(index, 1)[0];
	var x = key[0];
	var y = key[1];
	Game.player = new Player(x, y);
	return [freeCells, map];
};
