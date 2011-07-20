function Ludesik(renderer, menu){
    var map = new Map();
    var counter = 0;
    var soundPlayer;
    var intervalRef;
    var isPlaying = false;

    var playBtn;
    var pauseBtn;
    var slowFrequencyBtn;
    var frequencyInput;
    var speedFrequencyBtn;

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

    function play () {
        isPlaying = true;
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        intervalRef = setInterval(tick, frequencyInput.value);
    }

    function pause () {
        isPlaying = false;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        clearInterval(intervalRef);
    }

    function slowFrequency() {
        frequencyInput.value = Number(frequencyInput.value) - 100;

        if (frequencyInput.value === 0) {
            slowFrequencyBtn.disabled = true;
        }

        if (isPlaying) {
            pause();
            play();
        }
    }

    function speedFrequency() {
        frequencyInput.value = Number(frequencyInput.value) + 100;

        if (isPlaying) {
            pause();
            play();
        }
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

        soundPlayer = new SoundPlayer(document.getElementById('audios'), soundsInit);
    })();

    (function() {
        playBtn =  document.createElement('button');
        playBtn.textContent = 'Play';
        playBtn.disabled = false;
        playBtn.addEventListener('click', play, false);
        menu.appendChild(playBtn);

        pauseBtn =  document.createElement('button');
        pauseBtn.textContent = 'Pause';
        pauseBtn.disabled = true;
        pauseBtn.addEventListener('click', pause, false);
        menu.appendChild(pauseBtn);

        var frequencyContainer = document.createElement('div');

        slowFrequencyBtn =  document.createElement('button');
        slowFrequencyBtn.textContent = '-';
        slowFrequencyBtn.addEventListener('click', slowFrequency, false);
        frequencyContainer.appendChild(slowFrequencyBtn);

        frequencyInput = document.createElement('input');
        frequencyInput.value = 1000;
        frequencyContainer.appendChild(frequencyInput);

        speedFrequencyBtn =  document.createElement('button');
        speedFrequencyBtn.textContent = '+';
        speedFrequencyBtn.addEventListener('click', speedFrequency, false);
        frequencyContainer.appendChild(speedFrequencyBtn);

        menu.appendChild(frequencyContainer);
    }).call(this);
}
