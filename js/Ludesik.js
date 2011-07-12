function Ludesik(soundPlayer, renderer){
    var map = Map();
	var soundPlayer = SoundPlayer();
	var renderer = renderer;
    renderer.setOnSquareInteraction(addMobileAgent);
    var counter = 0;

	function addMobileAgent(position) {
		map.addMobileAgent(counter, 0, position);
		renderer.addMobileAgent(counter, position);

        counter++;
	}

	function onMobileAgentInteraction(id) {
		map.onMobileAgentInteraction(id);
	}

	function tick() {
		var result = map.nextStep();
		
		soundPlayer.playAll(result.wallsInCollision);
		
		renderer.refresh(result);
	}

    setTimeout(tick, 1000);

}
