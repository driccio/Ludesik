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
        var tempoInputs = document.getElementsByClassName('tempo-input');

        document.addEventListener("tempoChangeEvent",
                                  function (evt) {
                                      for (var i = 0; i < tempoInputs.length; i++) {
                                            tempoInputs[i].value = evt.tempo;
                                      }
                                  },
                                  false
        );

        ludesik = new Ludesik(/*new SoundPlayer(), */new Renderer(container), menu);

        for (var i = 0; i < tempoInputs.length; i++) {
            tempoInputs[i].addEventListener('change',
                                                 function (evt){
                                                     ludesik.setTempo(parseInt(evt.currentTarget.value));
                                                 },
                                                 false
            );
        }
    }
    
    document.addEventListener('DOMContentLoaded', init, false);
    
})(this);
