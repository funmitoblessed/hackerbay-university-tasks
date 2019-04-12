/*
* @description The collectible classes are created below. The functions first place the collectibles off the canvas and when
* 		a certain period elapses, the collectibles change location back to canvas. When the player hits the collectibles,
*		the score increases appropriately and they change location again, off canvas.
*/

//Gems
let Gems = function(x, y) {
    this.x = -300;
    this.y = -300;
    this.sprite = 'images/Gem Blue.png';
	
    this.xGemLocation = [305, 200, 130];
    this.yGemLocation = [200, 102, 60];
	
	setTimeout(() => {
		this.x = this.xGemLocation[Math.floor(Math.random() * this.xGemLocation.length)];
		this.y = this.yGemLocation[Math.floor(Math.random() * this.yGemLocation.length)];
	}, Math.random() * 20000);
};

Gems.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gems.prototype.update = function () {
	const gemArray = [
              'images/Gem Blue.png',
              'images/Gem Green.png',
              'images/Gem Orange.png'
	];
	
	if (player.x + 80 > this.x && 
	player.x < this.x + 80 && 
	player.y + 50 > this.y && 
	player.y < this.y + 50) {
		this.sprite = gemArray[Math.floor(Math.random() * gemArray.length)];
		scoreCounter.innerHTML = `Score: ${score+= 5}`;
		
	//located off canvas initially
		this.x = -300;
		this.y = -300;

	// But after the time is elapsed, the gem appears
		setTimeout(() => {
			this.x = this.xGemLocation[Math.floor(Math.random() * this.xGemLocation.length)];
			this.y = this.yGemLocation[Math.floor(Math.random() * this.yGemLocation.length)];
		}, Math.random() * 20000);
	}
}

//keys
let Key = function(x, y) {
    this.x = -100;
    this.y = -400;
    this.sprite = 'images/Key.png';
	
    this.xKeyLocation = [400, 300, 100];
    this.yKeyLocation = [230, 104, 70];
	
	setTimeout(() => {
		this.x = this.xKeyLocation[Math.floor(Math.random() * this.xKeyLocation.length)];
		this.y = this.yKeyLocation[Math.floor(Math.random() * this.yKeyLocation.length)];
	}, Math.random() * 30000);
};

Key.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Key.prototype.update = function () {
	if (player.x + 80 > this.x && 
	player.x < this.x + 80 && 
	player.y + 50 > this.y && 
	player.y < this.y + 50) {
		
		scoreCounter.innerHTML = `Score: ${score+= 15}`;
		
	//Located off canvas initially
		this.x = -100;
		this.y = -400;

	// But after the time is elapsed, the gem appears
		setTimeout(() => {
			this.x = this.xKeyLocation[Math.floor(Math.random() * this.xKeyLocation.length)];
			this.y = this.yKeyLocation[Math.floor(Math.random() * this.yKeyLocation.length)];
		}, Math.random() * 30000);
	}
}

//instantiate objects
const gem = new Gems();
const key = new Key();
