/**
 * Copyright (c) 2011 David Bruant & Damien Riccio
 * MIT Licence
 */

function SoundPlayer(container, sounds) {
    var audios;

    console.log(sounds);

    this.playAll = function(soundIds){
        soundIds.forEach(function(id){
            console.log(id, audios[id]);
            audios[id].play();
        });
    };


    (function() {
        var ids = Object.keys(sounds);
        audios = {};

        ids.forEach(function(id){
            var a = new Audio(sounds[id]);
            a.preload = true;

            audios[id] = a;
        });

        ids.forEach(function(id){
            container.appendChild(audios[id]);
        });

    }).call(this);
}
