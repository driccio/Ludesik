function MobileAgent(id) {
	this.id = id
    
	this.direction = {deltaX:0, deltaY:1};
	this.increment = 1;
	
	this.onWallsCollision = function(walls){};
	  
	this.onMobileAgentsCollision = function(mobileAgents){
        // TODO
        //this.direction = (this.direction+1)%4;
    };
	         
	this.onInteraction = function(){
	    // TODO
        //this.direction = (this.direction+1)%4;
    };
}
