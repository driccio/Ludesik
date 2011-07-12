function Renderer(container){
    var MAX_X = 9, MAX_Y = 9;
    var squares = []; // A weakmap would be prefered to have O(1)-ish look-up
    var document = container.ownerDocument;
    var onSquareInteraction, onMobileAgentInteraction;
    var mobileAgents = [];
 
    this.addMobileAgent = function(maId, pos){
                              var index = pos.y*MAX_X + pos.x;
                              var square = squares[index];
                              var maElement = document.createElement('div');
                              maElement.className = "mobile-agent";

                              /* To keep in sync with .mobile-agent & .map-cell css rules */
                              maElement.style.top = (pos.y*61) + 1 + 'px'; 
                              maElement.style.left = (pos.x*61) + 1 + 'px'; 
                              
                              maElement.addEventListener('click', function(){
                                                                      var newStyle = onMobileAgentInteraction(maId);
                                                                      for(style in newStyle){
                                                                          if(["top", "left", "bottom", "right"].indexOf(style) !== -1) 
                                                                              continue;
                                                                          // Beware handling for: margin, border, width, height, display, visibility, float?
                                                                          // position
                                                                          
                                                                          if(style === "className"){
                                                                              maElement.className = style;
                                                                              continue;
                                                                          }
                                                                          
                                                                          maElement.style[style] = newStyle[style];
                                                                      }
                                                                  }, false);
                              
                              container.appendChild(maElement);

                              mobileAgents[maId] = maElement;
                          };


    this.refresh = function(state){
                       state.positions.forEach(
                        function (e, i, a) {
                             var maElement = mobileAgents[e.id];
                             var pos = e.position;
                             maElement.style.top = (pos.y*61) + 1 + 'px'; 
                             maElement.style.left = (pos.x*61) + 1 + 'px';
                        }
                       );
                   };

    this.setOnSquareInteraction = function(f){
                                      onSquareInteraction = f;
                                      delete this.setOnSquareInteraction;
                                  };

    this.setOnMobileAgentInteraction = function(f){
                                           onMobileAgentInteraction = f;
                                           delete this.setOnMobileAgentInteraction;
                                       };

    (function(){
        var i,j;
        var row, cell, table;
        var document;
    
        if(typeof container !== "object" || container === null || !container.ownerDocument)
            throw new TypeError('Could not initialize Renderer: container is not a DOM Node. '+ container);

        document = container.ownerDocument;
        table = document.createDocumentFragment();
        
        for(i=0 ; i<MAX_Y ; i++){
            row = document.createElement('div');
            row.className = "map-row";
        
            for(j=0 ; j<MAX_X ; j++){
                cell = document.createElement('div');
                cell.className = "map-cell";
                
                squares.push(cell);
                
                row.appendChild(cell);
            }
        
            table.appendChild(row);
        }
        
        container.appendChild(table);
        
        container.addEventListener('click', function(e){
                                                var i = squares.indexOf(e.target);
                                                var x;
                                                if(i !== -1){ // clicked on a square
                                                    x = i%MAX_X;
                                                    onSquareInteraction({x:x, y:(i - x)/MAX_Y});
                                                }
                                            }, false);
    }).call(this);


}


