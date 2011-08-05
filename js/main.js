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

        ludesik = new Ludesik(/*new SoundPlayer(), */new Renderer(container), menu);
    }
    
    document.addEventListener('DOMContentLoaded', init, false);
    
})(this);
