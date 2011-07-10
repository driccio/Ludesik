var map = Map();
var soundPlayer = SoundPlayer();
var renderer = Renderer();

function addMobileAgent() {
	//TODO : manage position and id generation. Direction is set with a default value.
	
	map.addMobileAgent(id, direction, x, y);
	renderer.addMobileAgent(id);
}

function onMobileAgentInteraction(id) {
	map.onMobileAgentInteraction(id);
}

function tick() {
	var result = map.nextStep();
	
	soundPlayer.playAll(results.wallIds);
	
	renderer.render(results);
}

setInterval(tick, 1000);
