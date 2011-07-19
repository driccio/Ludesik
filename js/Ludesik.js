function Ludesik(renderer){
    var map = new Map();
    var counter = 0;
    var soundPlayer;

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

    (function(){
        var ids = map.getWallIds();
        var soundsInit = {};
        
        ids.forEach(function(id, i){
                        // not our files. Begging for people to create us awesome tones
                        soundsInit[id] = "http://dl.dropbox.com/u/20485/otomata/sounds/" + i%9 + ".ogg";
                    });
        
        soundPlayer = new SoundPlayer(Object.getElementById('audios'), soundsInit);
    })();

	function tick() {
		var result = map.nextStep();
		
		soundPlayer.playAll(result.wallsInCollision);
		
		renderer.refresh(result);
	}

    setInterval(tick, 1000);

}
