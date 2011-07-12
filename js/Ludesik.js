function Ludesik(soundPlayer, renderer){
    var map = new Map();
    var counter = 0;

	function addMobileAgent(position) {
		map.addMobileAgent(counter, 0, position);
		renderer.addMobileAgent(counter, position);

        counter++;
	}

	function onMobileAgentInteraction(id) {
		map.onMobileAgentInteraction(id);
	}

    renderer.setOnSquareInteraction(addMobileAgent);
    renderer.setOnMobileAgentInteraction(onMobileAgentInteraction);


	function tick() {
		var result = map.nextStep();
		
		soundPlayer.playAll(result.wallsInCollision);
		
		renderer.refresh(result);
	}

    setInterval(tick, 1000);

}
