function Renderer(container){
    var MAX_X = 9, MAX_Y = 9;
    var squares = []; // A weakmap would be prefered to have O(1)-ish look-up
    var document = container.ownerDocument;
    var onSquareInteraction, onMobileAgentInteraction;
    var mobileAgents = [];

    function randomColorString(){
        var r, g, b;

        r = Math.floor(256*Math.random()).toString(10);
        g = Math.floor(256*Math.random()).toString(10);
        b = Math.floor(256*Math.random()).toString(10);

        return ('rgb('+ r +','+ g +','+ b +')');
    }

    this.addMobileAgent = function(maId, pos, direction){
        var index = pos.y*MAX_X + pos.x;
        var square = squares[index];
        var maElement = document.createElement('div');
        maElement.className = "mobile-agent";
        refreshArrow(maElement, direction);

        /* To keep in sync with .mobile-agent & .map-cell css rules */
        // Play around with 60/61 to get nice rendering depending on browser
        maElement.style.top = (pos.y*60) + 1 + 'px';
        maElement.style.left = (pos.x*61) + 1 + 'px';

        maElement.style.backgroundColor = randomColorString();

        maElement.addEventListener('click', function(){
            var newInformations = onMobileAgentInteraction(maId);

            maElement.className = "mobile-agent";
            refreshArrow(maElement, newInformations.direction);

            // I didn't like what we done here so I removed it. :-)
//            for(style in newStyle){
//                if(["top", "left", "bottom", "right"].indexOf(style) !== -1)
//                    continue;
//                // Beware handling for: margin, border, width, height, display, visibility, float?
//                // position
//
//                if(style === "className"){
//                    maElement.className = maElement.className + " " + newStyle[style];
//                    continue;
//                }
//
//                maElement.style[style] = newStyle[style];
//            }
        }, false);

        // Rendering incompatbilities on FF4, Chrome 12 and Opera 11.50
        // led us to create a compatibility-container to append mobile agents to.
        container = document.getElementById('compat-container2');
        container.appendChild(maElement);

        mobileAgents[maId] = maElement;
    };

    function refreshArrow(maElement, direction) {
        if (direction.deltaY >= 0 && direction.deltaX > 0){
            maElement.className += ' right-arrow';
        } else {
            if (direction.deltaY <= 0 && direction.deltaX < 0) {
                maElement.className += ' left-arrow';
            } else {
                if (direction.deltaY < 0 && direction.deltaX >= 0) {
                    maElement.className += ' top-arrow';
                } else {
                    maElement.className += ' bottom-arrow';
                }
            }
        }
    }

    this.refresh = function(state){
        state.positions.forEach(
            function (e, i, a) {
                var maElement = mobileAgents[e.id];
                var pos = e.position;

                // Play around with 60/61 to get nice rendering depending on browser
                maElement.style.top = (pos.y*60) + 1 + 'px';
                maElement.style.left = (pos.x*61) + 1 + 'px';

                var direction = e.direction;
                maElement.className = "mobile-agent";
                refreshArrow(maElement, direction);
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


