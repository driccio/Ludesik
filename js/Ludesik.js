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

    var tempo;

    var playBtns;
    var pauseBtns;
    var slowFrequencyBtns;
    //var frequencyInput;
    var speedFrequencyBtns;
    var saveBtns;
    var clearBtns;
    var savedStateContainers;

    var savedStateCount = 0;

    function callFunctionOnItems (items, f) {
        for (var i = 0; i < items.length; i++) {
            f(items[i]);
        }
    }

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

        callFunctionOnItems(playBtns,
            function (btn) {
                btn.disabled = true;
            }
        );

        callFunctionOnItems(pauseBtns,
            function (btn) {
                btn.disabled = false;
            }
        );

        intervalRef = setInterval(tick, (60/tempo) * 1000);
    }

    function pause () {
        isPlaying = false;

        callFunctionOnItems(playBtns,
            function (btn) {
                btn.disabled = false;
            }
        );

        callFunctionOnItems(pauseBtns,
            function (btn) {
                btn.disabled = true;
            }
        );

        clearInterval(intervalRef);
    }

    function setTempo(_tempo) {
        tempo = _tempo;

        if (tempo === 0) {
            callFunctionOnItems(slowFrequencyBtns,
                function (btn) {
                    btn.disabled = true;
                }
            );
        }

        if (isPlaying) {
            pause();
            play();
        }

        var event = document.createEvent("Event");
        event.initEvent("tempoChangeEvent", false, true);
        event.tempo = tempo;
        document.dispatchEvent(event);
    }

    function decreaseFrequency() {
        setTempo(tempo-1);
    }

    function increaseFrequency() {
        setTempo(tempo+1);
    }

    function clear() {
        counter = 0;
        map.clear();
        renderer.clear();
    }

    function loadState(serializedState) {
        clear();

        var split = serializedState.split(";");
        //frequencyInput.value = split[1];
        tempo = split[1];

        if (serializedState[0] === '1') {
            for (var i=4; i< split.length; i+=4) {
                addMobileAgentWithDirection({x: Number(split[i]), y: Number(split[i+1])}, {deltaX: Number(split[i+2]), deltaY: Number(split[i+3])});
            }
        }

        var splittedUrl = window.location.href.split('#');

        window.location.href = splittedUrl[0] + '#' + serializedState;
    }

    function addSavedStateIntoContainer(serializedState) {
        var savedState =  document.createElement('li');
        savedState.textContent = 'State ' + (++savedStateCount);
        savedState.contentEditable = true;
        savedState.addEventListener('click', function (){loadState(serializedState)}, false);

        callFunctionOnItems(savedStateContainers,
            function (container) {
                container.appendChild(savedState);
            }
        );
    }

    function saveState() {
        var currentPositions = map.getPositions();

        var serializedState = '';


        serializedState += '1;';
        serializedState += tempo;
        serializedState += ';9;9'; // map size. May be changeable eventually.


         currentPositions.positions.forEach(
			function (e, i, a) {
                serializedState += ';' + e.position.x + ';' + e.position.y + ';' + e.direction.deltaX + ';' + e.direction.deltaY;
            }
        );

        addSavedStateIntoContainer(serializedState);
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

    /* Yes, setTempo is a public method and it calls the setTempo private method.
    * The reason of that is security. Indeed the client could override setTempo method
    * but some others private methods depends on setTempo method. So having a private
    * setTempo method is a way to warranty that the behaviour of these methods will be allways the same */
    this.setTempo = function (_tempo) {
        setTempo(_tempo);
    }

    renderer.setOnSquareInteraction(addMobileAgent);
    renderer.setOnMobileAgentInteraction(onMobileAgentInteraction);

    (function(){
        // INIT SOUNDS
        var walls = map.getWalls();
        var soundsInit = {};

        walls.forEach(function(wall, i){
            //console.log("soundinit", wall, i);
            id = wall.cardinal + wall.index;
            
            if(wall.cardinal === "N" || wall.cardinal === "S"){
                soundsInit[id] = "http://dl.dropbox.com/u/20485/otomata/sounds/" + wall.index + ".ogg";
            }
            else{
                soundsInit[id] = "http://dl.dropbox.com/u/20485/otomata/sounds/" + (8 - wall.index)  + ".ogg";
            }
            
            //if()
            
            /*if(i){
                    // not our files. Begging for people to create us awesome tones
                    soundsInit[id] = "http://dl.dropbox.com/u/20485/otomata/sounds/" + i%9 + ".ogg";
                
                
                }
        */
        });

        soundPlayer = new SoundPlayer(document.getElementById('audios'), soundsInit);

        playBtns =  menu.getElementsByClassName('play-control');
        // TODO: Manage errors

        callFunctionOnItems(playBtns,
            function (btn) {
                btn.disabled = false;
                btn.addEventListener('click', play, false);
            }
        );

        pauseBtns =  menu.getElementsByClassName('pause-control');
        callFunctionOnItems(pauseBtns,
            function (btn) {
                btn.disabled = true;
                btn.addEventListener('click', pause, false);
            }
        );

        saveBtns =  menu.getElementsByClassName('save-control');
        callFunctionOnItems(saveBtns,
            function (btn) {
                btn.addEventListener('click', saveState, false);
            }
        );

        clearBtns =  menu.getElementsByClassName('clear-control');
        callFunctionOnItems(clearBtns,
            function (btn) {
                btn.addEventListener('click', clear, false);
            }
        );

        slowFrequencyBtns =  menu.getElementsByClassName('decrease-tempo-control');
        callFunctionOnItems(slowFrequencyBtns,
            function (btn) {
                btn.addEventListener('click', decreaseFrequency, false);
            }
        );

        speedFrequencyBtns =  menu.getElementsByClassName('increase-tempo-control');
        callFunctionOnItems(speedFrequencyBtns,
            function (btn) {
                btn.addEventListener('click', increaseFrequency, false);
            }
        );

        savedStateContainers  = menu.getElementsByClassName('saved-states');

        setTempo(60);

        importStateFromCurrentUrlIfNeeded();
    }).call(this);
}
