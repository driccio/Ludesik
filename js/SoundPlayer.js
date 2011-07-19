function SoundPlayer(container, sounds) {
	var audios;
	
	this.playAll = function(soundIds){
	                   soundsIds.forEach(function(id){
	                                         audios[id].play();
	                                     });
	               };
	

	(function() {
	    var ids = Object.keys(sounds);
	    audios = ids.map(function(id){
	                         var a = new Audio(sounds[id]);
	                         a.preload = true;
	                         
	                         return a;
	                     });
	                     
	    ids.forEach(function(id){
	                    container.appendChild(audios[id]);
	                });
	
	}).call(this);
}
