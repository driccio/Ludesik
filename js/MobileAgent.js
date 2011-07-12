function MobileAgent(id) {
	this.id = id
    
	this.direction = {deltaX:0, deltaY:1};
	this.increment = 1;
	
	this.onWallsCollision = function(walls){
        this.direction.deltaX = -this.direction.deltaX;
        this.direction.deltaY = -this.direction.deltaY;
    };
	  
	this.onMobileAgentsCollision = function(mobileAgents){
        // TODO

    };
	         
	this.onInteraction = function(){
	    // TODO
        //this.direction = (this.direction+1)%4;
    };
}
