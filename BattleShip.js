let view = {  // Is an object to display message in the game
    displayMessage : function(msg){
        var messageArea = document.getElementById("messageDisplay"); // get the id of message display form the DOM
        messageArea.innerHTML = msg; // assign a message to the inner HTMl
    },

    displayHit: function(location){
        var cell = document.getElementById(location); // get;'s the id of location
        cell.setAttribute("class", "hit"); //set or give's a class of hit to the DOM
    },
    
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss"); //set or give a class of miss to the DOm
    }
};

function init(){

    model.generateShipLocation(); //generate is random ship location

    var fireButton = document.getElementById("fireButton"); //get's the id of the button
    fireButton.onclick = handlerFireButton;  // pass the id to fire handler function
    var guessInput = document.getElementById("gustInput"); //getting gust input id
    guessInput.onkeypress = handleKeyPress;
    function handlerFireButton() {
        var gustInput = document.getElementById("gustInput"); // gut's the id of the gustInput
        var guess = gustInput.value; // get's the value of the gustInput
       controller.processGuess(guess); // pass the value of the gustInput to the controller

        gustInput.value = ""; //reset's the gust input after reload.
    }
    function handleKeyPress(e) {
        var fireButton = document.getElementById("fireButton");
        if(e.keyCode === 13) {
            fireButton.click();
            return false;
        }
    }
}

window.onload = init; // run the above code after the DOM is loaded

let controller = {
    guesses: 0, // initial guess of the gust is zero
    processGuess: function(guess) {         
        var location = parseGuess(guess); //assign the gust input to location

        if (location) { // then if location is true
            this.guesses++; // then add the guesses by one  
            var hit = model.fire(location); // then run the function fire at gust input location
            if(hit && model.shipsSunk === model.numShips) { //then if hit is true and if shipsSunk and numShips are equal
                view.displayMessage("You sunk my battleships, in " + this.guesses + " guesses"); // then display message
            }
        }
    }
}
function parseGuess(guess) { 
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if(guess === null || guess.length !== 2) { /*if the gust input guess is not null or if the guess length is not equal to two! */
        alert("Oops, please enter a letter and a number on the  board."); // then alert
    }else{ // INPUT CONVERSION TAKES PLACE HERE
        firstChar = guess.charAt(0); // assign the first character of the guess to firstChar
        var row = alphabet.indexOf(firstChar); //assign row the value of firstChar
        var column = guess.charAt(1); //assign the second character of the guess to column

        if(isNaN(row) || isNaN(column)) { // if row or column is not a number then
            alert("Oops, that isn't on the  board."); // display alert
        }else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { /* is row is less than zero or if row is greater than or equal to board size OR if column is less than zero or if column is greater than or equal to board size then*/
            alert("Oops, that is off the board!"); // display alert
        }else {
            return row + column; // else return the concatenation of row and column
        }
    }
    return null; // else return null
}


let model = {
    boardSize : 7, // Board Size is the size of the board in x- axis from A to G and y a-axis from 0 - 6
    numShips : 3, // is the number of ships on the play ground
    shipsSunk: 0, // is the number of ships sunk when it get's a hit.
    shipLength: 3, // is the length of the ship that hold on the board
    ships : [{locations:[0, 0, 0], hits:["","",""]},
             {locations:[0, 0, 0], hits:["","",""]},
             {locations:[0, 0, 0], hits:["","",""]}], // the locations of the ships

    fire : function(guess) {
        for ( var i = 0; i < this.numShips; i++) { // iterates until the number of ships on the board
            var ship = this.ships[i]; // assign the ships location above to ship
            var index = ship.locations.indexOf(guess); /* find the guess by using indexOf method in each ship location and assign to index */

            if(index >= 0) { // if index is greater or equal  zero then
                ship.hits[index] = "hit"; //add hit class to ship.hits at the index given 
                view.displayHit(guess); // and call the function to display the image at gust input value
                view.displayMessage("HIT!"); // and display the message "HIT"
                if(this.isSunk(ship)) {  // if isSunk is true then 
                    view.displayMessage("You sank my battleship!"); // display "You sank my battleship"
                    this.shipsSunk++ // increase shipsSunk by one
                }
                return true; // if the above is false return true
            }
        }
        view.displayMiss(guess); // then if the above condition is not full filled add a class miss
        view.displayMessage("You Missed."); // then display message miss
        return false; // then return false
    },
    isSunk: function(ship) {
        for(var i =0; i < this.shipLength; i++){
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocation: function() {
        var locations;
        for(var i=0; i < this.numShips; i++) {
            do{
                locations = this.generateShip();
            }while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip : function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;


        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i =0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            }else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for(var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for(var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
    }
}