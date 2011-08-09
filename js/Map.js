/**
 * Copyright (c) 2011 David Bruant & Damien Riccio
 * MIT Licence
 */

function Map() {
	var walls;
	var mobileAgents = [];
	var mobileAgentsPositions = [];
	var mobileAgentPerSquare = [];
	
	function getMobileAgentPerSquareIndex(id) {
		return (mobileAgentsPositions[id].y * 9) + mobileAgentsPositions[id].x;
	}

    this.getWalls = function () {
        return Object.keys(walls).map(function(n){return walls[n];});
    }

    /**
     * Add a mobile agent knowing its id, direction and position.
     * @param id the mobileAgent id
     * @param position the position (object with the properties x and y)
     * @param direction the direction (object with the properties deltaX and deltaY)
     */
    this.addMobileAgent = function (id, position, direction) {
        mobileAgents[id] = new MobileAgent(id, direction);
        mobileAgentsPositions[id] = position;
    };

    /**
     * Method call when on interaction with mobileAgent (click for instance).
     * @param id the mobileAgentId
     */
	this.onMobileAgentInteraction = function(id){     * onInteraction is called when the user interacts on a {@link mobileAgent}.
     * The notion of interaction is defined in the {@link Renderer} object. It can be a click, a focus ...
     *
		return mobileAgents[id].onInteraction();
	};

    /**
     * The nextStep function compute all the new positions of mobileAgents, and detect the collisions with walls and mobileAgents.
     */
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

				var x = mobileAgentsPositions[e.id].x + (e.direction.deltaX);
				var y = mobileAgentsPositions[e.id].y + (e.direction.deltaY);

                mobileAgentsPositions[e.id].x = x;
				mobileAgentsPositions[e.id].y = y;

				if (x < 1 && e.direction.deltaX < 0) {
					westSiteCollision = true;
					mobileAgentsPositions[e.id].x = -x;
				}
				
				if (y < 1 && e.direction.deltaY < 0) {
					northSiteCollision = true;
					mobileAgentsPositions[e.id].y = -y;
				}
				
				if (x >= 8 && e.direction.deltaX > 0) {
					eastSiteCollision = true;
					mobileAgentsPositions[e.id].x = 16-x;
				}
				
				if (y >= 8 && e.direction.deltaY > 0) {
					southSiteCollision = true;
					mobileAgentsPositions[e.id].y = 16-y;
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
				
				mobileAgentPerSquare[getMobileAgentPerSquareIndex(e.id)].push(e);
			}
		);

		mobileAgentPerSquare.forEach(
			function (e, i, a) {
				if (mobileAgentPerSquare[i].length > 1) {
					mobileAgentPerSquare[i].forEach(
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
                state.positions.push({id:e.id, position:mobileAgentsPositions[e.id], direction:e.direction});
            }
        );

		return state;
	};

    this.getPositions = function() {
        var state = new Object();

        state.positions = new Array();

        mobileAgents.forEach(
			function (e, i, a) {
                state.positions.push({id:e.id, position:mobileAgentsPositions[e.id], direction:e.direction});
            }
        );

        return state;
    };

    this.clear = function() {
        mobileAgents = [];
	    mobileAgentsPositions = [];

        mobileAgentPerSquare = [];

	    for(i = 0; i<9*9 ; i++){
		    mobileAgentPerSquare[i] = [];
		 }
    };

	(function() {
		 var i;
		 
		 for(i = 0; i<9*9 ; i++){
		    mobileAgentPerSquare[i] = [];
		 }
		 
		 walls = {};
		 
		 for (var i = 0 ; i < 9 ; i++) {
			walls["W" + i] = new Wall(i, 'W');
			walls["N" + i] = new Wall(i, 'N');
			walls["E" + i] = new Wall(i, 'E');
			walls["S" + i] = new Wall(i, 'S');
		 }
		 		    
	}).call(this);
}
