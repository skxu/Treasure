Game.World = function() {
	//this.mainTown = null;
	//this.dungeonList = null;
	var mapList = Game.Map.generateCellularMap(Game.width, Game.height);
	this.dungeon = new Game.Map(mapList);
	
	//generate towns, etc
	Game.world = this;
};


//placeholder
Game.World.prototype.generateWorld = function() {
	
}