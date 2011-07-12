function MobileAgent(id) {
	this.id = id
    
	this.direction = 0;
	this.increment = 1;
	
	this.onWallsCollision = function(walls){};
	  
	this.onMobileAgentsCollision = function(mobileAgents){
        this.direction = (this.direction+1)%4;
    };
	         
	this.onInteraction = function(){
        this.direction = (this.direction+1)%4;
    };
}
