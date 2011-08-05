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

    function clear() {
        counter = 0;
        map.clear();
        renderer.clear();
    }

    function loadState(serializedState) {
        clear();

        var split = serializedState.split(";");
        frequencyInput.value = split[1];

        if (serializedState[0] === '1') {
            for (var i=4; i< split.length; i+=4) {
                addMobileAgentWithDirection({x: Number(split[i]), y: Number(split[i+1])}, {deltaX: Number(split[i+2]), deltaY: Number(split[i+3])});
            }
        }

        var splittedUrl = window.location.href.split('#');

        window.location.href = splittedUrl[0] + '#' + serializedState;
    }

    function addSavedStateIntoContainer(serializedState) {
        var savedState =  document.createElement('div');
        savedState.textContent = 'Test ' + serializedState;
        savedState.addEventListener('click', function (){loadState(serializedState)}, false);
        savedStateContainer.appendChild(savedState);
    }

    function saveState() {
        var currentPositions = map.getPositions();

        var serializedState = '';

        serializedState += '1;';
        serializedState += frequencyInput.value;
        serializedState += ';9;9';

         currentPositions.positions.forEach(
			function (e, i, a) {
                serializedState += ';' + e.position.x + ';' + e.position.y + ';' + e.direction.deltaX + ';' + e.direction.deltaY;
            }
        );

        addSavedStateIntoContainer(serializedState)

        console.log(serializedState);
    }

    function importState(url) {
        if (!url) {
            // TODO: Set an error message
            return;
        }

        var splittedUrl = url.split('#');

        if (splittedUrl.length !== 2) {
            // TODO: Set an error message
            return;
        }

        var splittedSerializedState = splittedUrl[1].split('=');

        if (splittedSerializedState.length !== 2 && splittedSerializedState[0] !== 's') {
            // TODO: Set an error message
            return;
        }

        addSavedStateIntoContainer(splittedSerializedState[1]);
        loadState(splittedSerializedState[1]);
    }

    function importStateFromCurrentUrlIfNeeded() {
        if (window.location.href.indexOf('#') !== -1) {
            importState(window.location.href);
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

        saveBtn =  document.createElement('button');
        saveBtn.textContent = 'Sauver';
        saveBtn.addEventListener('click', saveState, false);
        menu.appendChild(saveBtn);

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


        savedStateContainer = document.createElement('div');
        menu.appendChild(savedStateContainer);

        importStateFromCurrentUrlIfNeeded();
    }).call(this);
}
