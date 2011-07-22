function MobileAgent(id, direction) {
    this.id = id

    this.direction = direction;
    this.increment = 1;

    function computeNextPosition() {
        if ((this.direction.deltaY >= 0 && this.direction.deltaX > 0) ||
            (this.direction.deltaY <= 0 && this.direction.deltaX < 0)) {
            var tmp = -this.direction.deltaY;
            this.direction.deltaY = this.direction.deltaX;
            this.direction.deltaX = tmp;
        } else {
            var tmp = this.direction.deltaX;
            this.direction.deltaX = -this.direction.deltaY;
            this.direction.deltaY = tmp;
        }
    }

    this.onWallsCollision = function(walls){
        walls.forEach(
            function (e, i, a) {
                switch(e.cardinal) {
                    case 'W':
                    case 'E' :
                        this.direction.deltaX = -this.direction.deltaX;
                        break;
                    case 'N':
                    case 'S':
                        this.direction.deltaY = -this.direction.deltaY;
                        break;
                }
            },
            this
        );
    };

    this.onMobileAgentsCollision = function(mobileAgents){
        computeNextPosition.call(this);
    };

    this.onInteraction = function(){
        computeNextPosition.call(this);

        return {direction: direction};
    };
}
