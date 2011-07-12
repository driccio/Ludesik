function Map() {
	var walls;
	var mobileAgents = [];
	var mobileAgentsPositions = [];
	var mobileAgentPerSquare;
	
	function getMobileAgentPerSquareIndex(id) {
		return (mobileAgentsPositions[id].y * 9) + mobileAgentsPositions[id].x;
	}
	
	this.addMobileAgentPosition = function (id, direction, position) {
		mobileAgents[id] = new MobileAgent(id);
		mobileAgentsPositions[id] = position;
	};
		     
	this.onMobileAgentInteraction = function(id){
		mobileAgents[id].onIteraction();
	};
	
	this.nextStep = function () {
		var state = new State();
		
		mobileAgents.forEach(
			function (e, i, a) {
				var wallsInCollisionWith = [];
				
				var westSiteCollision = false;
				var northSiteCollision = false;
				var eastSiteCollision = false;
				var southSiteCollision = false;
				
				var mobileAgentsInSquare = mobileAgentPerSquare[getMobileAgentPerSquareIndex(e.id)];
				mobileAgentsInSquare.splice(mobileAgentsInSquare.indexOf(e) - 1,1);
				
				var x = mobileAgentsPositions[e.id].x + (e.direction.deltaX * e.increment);
				var y = mobileAgentsPositions[e.id].y + (e.direction.deltaY * e.increment);
				
				if (x < 0) {
					westSiteCollision = true;
					mobileAgentsPositions[e.id].x = 0;
				}
				
				if (y < 0) {
					northSiteCollision = true;
					mobileAgentsPositions[e.id].y = 0;
				}
				
				if (x >= 9) {
					eastSiteCollision = true;
					mobileAgentsPositions[e.id].x = 8;
				}
				
				if (y >= 9) {
					southSiteCollision = true;
					mobileAgentsPositions[e.id].y = 8;
				}
				
				if (westSiteCollision) {
					state.wallsInCollision.push("W" + mobileAgentsPositions[e.id].y);
					wallsInCollisionWith.push(walls["W" + mobileAgentsPositions[e.id].y]);
				}
				
				if (northSiteCollision) {
					state.wallsInCollision.push("N" + mobileAgentsPositions[e.id].x);
					wallsInCollisionWith.push(walls["N" + mobileAgentsPositions[e.id].x]);
				}
				
				if (eastSiteCollision) {
					state.wallsInCollision.push("E" + mobileAgentsPositions[e.id].y);
					wallsInCollisionWith.push(walls["E" + mobileAgentsPositions[e.id].y]);
				}
				
				if (southSiteCollision) {
					state.wallsInCollision.push("S" + mobileAgentsPositions[e.id].x);
					wallsInCollisionWith.push(walls["S" + mobileAgentsPositions[e.id].x]);
				}
				
				if (wallsInCollisionWith.length > 0) {
					state.mobileAgentsInWallCollision.push(e.id);
					e.onWallsCollision(wallsInCollisionWith);
				}
				
				mobileAgentPerSquare[getMobileAgentPerSquareIndex(e.id)].push[e];
			}
		);
		
		mobileAgentPerSquare.forEach(
			function (e, i, a) {
				if (mobileAgentPerSquare[i].length > 1) {
					mobileAgentPerSquare[i].foreach(
						function (e, j, a) {
							mobileAgentPerSquare[i][j].onMobileAgentsCollision(
								mobileAgentPerSquare[i].slice(mobileAgentPerSquare[i].indexOf(e) - 1, 1));
								
							state.mobileAgentsInMobileAgentCollision.push(e.id);
						}
					);
				}
			}
		);

        mobileAgents.forEach(
			function (e, i, a) {
                state.positions.push({id:e.id, position:mobileAgentsPositions[e.id]});
            }
        );

		return state;
	};
	
	(function() {
		 mobileAgentPerSquare = new Array(9*9);
		 
		 mobileAgentPerSquare.foreach(
			 function (e, i, a) {
				 mobileAgentPerSquare[i] = [];
			 }
		 );
		 
		 walls = new Object();
		 
		 for (var i = 0 ; i < 9 ; i++) {
			walls["w" + i] = new Wall(i);
			walls["N" + i] = new Wall(i + 9);
			walls["E" + i] = new Wall(i + 18);
			walls["S" + i] = new Wall(i + 27);
		 }
		 		    
	}).call(this);
}
