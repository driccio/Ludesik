/**
 * Copyright (c) 2011 David Bruant & Damien Riccio
 * MIT Licence
 */

(function(global){
    var ludesik;
    var document = global.document;
    
    function init(){
        var container = document.querySelector('.map-container'); // only the first one
        var menu = document.getElementById('menu');
        var frequencyInputs = document.getElementsByClassName('frequency-input');

        document.addEventListener("tempoChangeEvent",
                                  function (evt) {
                                      for (var i = 0; i < frequencyInputs.length; i++) {
                                            frequencyInputs[i].value = evt.tempo;
                                      }
                                  },
                                  false
        );

        ludesik = new Ludesik(/*new SoundPlayer(), */new Renderer(container), menu);
    }
    
    document.addEventListener('DOMContentLoaded', init, false);
    
})(this);
