/**
 * Copyright (c) 2011 David Bruant & Damien Riccio
 * MIT Licence
 */

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
    var saveBtn;
    var savedStateContainer;

    function addMobileAgentWithDirection(position, direction) {
        map.addMobileAgent(counter, position, direction);
        renderer.addMobileAgent(counter, position, direction);

        counter++;
    }

    function addMobileAgent(position) {
        var defaultDirection = {deltaX: 1, deltaY: 0};
        addMobileAgentWithDirection(position, defaultDirection);
    }

    function onMobileAgentInteraction(id) {
        return map.onMobileAgentInteraction(id);
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
        intervalRef = setInterval(tick, 60/parseInt(frequencyInput.value) * 1000);
    }

    function pause () {
        isPlaying = false;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        clearInterval(intervalRef);
    }

    function decreaseFrequency() {
        frequencyInput.value = parseInt(frequencyInput.value) - 1;

        if (frequencyInput.value === 0) {
            slowFrequencyBtn.disabled = true;
        }

        if (isPlaying) {
            pause();
            play();
        }
    }

    function increaseFrequency() {
        frequencyInput.value = parseInt(frequencyInput.value) + 1;

        if (isPlaying) {
            pause();
            play();
        }
    }

    function clear() {
        counter = 0;
        map.clear();
        renderer.clear();
    }

    function loadState(url) {
        clear();

        var split = url.split(";");
        frequencyInput.value = split[0];

        for (var i=3; i< split.length; i+=4) {
            addMobileAgentWithDirection({x: Number(split[i]), y: Number(split[i+1])}, {deltaX: Number(split[i+2]), deltaY: Number(split[i+3])});
        }
    }

    function addSavedStateIntoContainer(url) {
        var savedState =  document.createElement('div');
        savedState.textContent = 'Test ' + url;
        savedState.addEventListener('click', function (){loadState(url)}, false);
        savedStateContainer.appendChild(savedState);
    }

    function saveState() {
        var currentPositions = map.getPositions();

        var url = '';

        url += frequencyInput.value;
        url += ';9;9';

         currentPositions.positions.forEach(
			function (e, i, a) {
                url += ';' + e.position.x + ';' + e.position.y + ';' + e.direction.deltaX + ';' + e.direction.deltaY;
            }
        );

        addSavedStateIntoContainer(url)

        console.log(url);
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

        saveBtn =  document.createElement('button');
        saveBtn.textContent = 'Sauver';
        saveBtn.addEventListener('click', saveState, false);
        menu.appendChild(saveBtn);

        var frequencyContainer = document.createElement('div');

        slowFrequencyBtn =  document.createElement('button');
        slowFrequencyBtn.textContent = '-';
        slowFrequencyBtn.addEventListener('click', decreaseFrequency, false);
        frequencyContainer.appendChild(slowFrequencyBtn);

        frequencyInput = document.createElement('input');
        frequencyInput.type = "number";
        frequencyInput.value = 120;
        frequencyContainer.appendChild(frequencyInput);

        speedFrequencyBtn =  document.createElement('button');
        speedFrequencyBtn.textContent = '+';
        speedFrequencyBtn.addEventListener('click', increaseFrequency, false);
        frequencyContainer.appendChild(speedFrequencyBtn);

        menu.appendChild(frequencyContainer);


        savedStateContainer = document.createElement('div');
        menu.appendChild(savedStateContainer);
    }).call(this);
}
