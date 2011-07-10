function Renderer(container, onSquareInteraction){
    var MAX_X = 9, MAX_Y = 9;
    var squares = []; // A weakmap would be prefered to have O(1)-ish look-up
 
    this.addMobileAgent = function(ma, pos){
                              var index = pos.x*MAX_Y + pos.x;
                              var square = squares[index];

                              // create a graphical mobile agent
                              // compute pixel-based coordinates based on square.{top|left}
                              
                              
                          };


    this.refresh = function(){
    
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


