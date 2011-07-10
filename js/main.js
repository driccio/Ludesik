(function(global){
    var ludesik;
    var document = global.document;
    
    function init(){
        var container = document.querySelector('.map-container'); // only the first one
        
        ludesik = new Ludesik(new SoundPlayer(), new Renderer(container)); 
    }
    
    document.addEventListener('DOMContentLoaded', init, false);
    
})(this);
