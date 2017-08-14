jQuery(document).ready(function ($) {
    function saveGame(total) {
        //Saves the game in local storage if the browser is capable, otherwise it returns an alert message
        if (typeof(Storage) !== "undefined") {
            var content = $('#square').html(),
                time = $('#timer').html(),
                moves = $('#moves').html(),
                rating = $('#rating').html();
            localStorage.setItem("game", content);
            localStorage.setItem("time", time);
            localStorage.setItem("moves", moves);
            localStorage.setItem("rating", rating);
            localStorage.setItem("total", parseInt(total));
        } else {
            alert('Sorry, your browser does not support local storage and hence the game cannot be saved!');
        }
    }
    function fillArray(array, len) {
        //copy the elements of the array as many times as indicated by len, which should be greater than 0, and returns
        // and array
        var Array = [];
        $.each(array, function (index, value) {
            var length = len;
            while (length > 0) {
                Array.push(value);
                length -= 1;
            }
        });
        return Array;
    }
    function rotateDiv(divRotated) {
        //rotate a div 360 degrees in a second
        divRotated.stop().animate(
            {rotation: 360},
            { 
                duration: 1000,
                step: function(now, fx) {
                    $(this).css({"transform": "rotate("+now+"deg)"});
                }
            }
        );
    }
    function getRandomInt(min, max) {
        //Generate a random integer between a minimum (min) an a maximum value (max)
        //Got the function from https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range/#answer-1527820
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function buildSquare(squarePerSide, cards) {
        //Generate the content of the #square div, takes in two parameters, the number of cards per side, and an array with
        //the cards to be put into the div
        var squareHtml = '';
        for (var i = 0; i < squarePerSide; i++) {
            var row = 'row' + (i+1),
                rowDiv = '<div id="' + row + '">';
            for (var j = 0; j < squarePerSide; j++) {
                var arrayLength = cards.length - 1,
                    currentIndex = getRandomInt(0, arrayLength),
                    currentCard = cards[currentIndex],
                    column = 'column' + (j+1);
                cards.splice(currentIndex, 1);
                rowDiv += '<div class="' + column + '"><div class="card"><div class="face"></div><div class="back face"><img src="Images/' + currentCard + '.png" /></div></div></div>'; 
            }
            rowDiv += '</div>';
            squareHtml += rowDiv;
        }
        return squareHtml;
    }
    function Counter() {
        //Update the content of the #timer div with the new time, adding one second every time the function is called
        var seconds = $('#timer').html();
        seconds = seconds.split(':');
        seconds = parseInt((seconds[0]) * 60 * 60) + parseInt((seconds[1]) * 60) + parseInt(seconds[2]); 
        ++seconds;
        var date = new Date(null);
        date.setSeconds(seconds);
        var result = date.toISOString().substr(11, 8);
        $('#timer').html(result);
    }
    function addMove() {
        //Adds a move and updates the content of the rating div when the moves surpass a certain threshold.
        var moves = $('#moves').html().split(' ');
        moves = parseInt(moves[0]) + 1;
        if (moves === 1) {
            $('#moves').html(moves + ' move');
        } else {
            $('#moves').html(moves + ' moves');
            if (moves === 10){
                $('#rating span:nth-child(3)').last().html('&#9734');
            }
            if (moves === 20) {
                $('#rating span:nth-child(2)').last().html('&#9734');
            }
        }
    }
    function startGame(total) {
        //Starts the game, activating the modals, and the timer, and setting up the logic to make the game possible
        var previousChecking,
            firstDialogBox = {
                autoOpen:false,
                buttons: {
                    "OK": function() {
                        clearInterval(countingTime);
                        countingTime = false;
                        $('#timer').html('00:00:00');
                        $('#moves').html('0 moves');
                        $('#rating').html('<span>&#9733</span><span>&#9733</span><span>&#9733</span>');
                        var cards = ['Baseball','Basketball','Golf','Running','Skiing','Soccer','Volleyball','Yoga'],
                            cards = fillArray(cards, 2),
                            total = 0;
                        $('#square').html(buildSquare(4,cards));
                        startGame(total);
                        $( this ).dialog( "close" );		
                    }
                }
            },
            countingTime = setInterval(function(){ Counter() }, 1000),
            secondDialogBox = {
                autoOpen:false,
                buttons: {
                    "OK": function() {
                        saveGame(total);
                        $( this ).dialog( "close" );
                    }
                }
            };
        $('#dialog').dialog(firstDialogBox);
	    $('#winning').dialog(firstDialogBox);
        $('#saving').dialog(secondDialogBox);
        $('#row1 > div,#row2 > div,#row3 > div,#row4 > div').hide().each(function (i) {
            $(this).delay(i*150).fadeIn(1000); //deals the cards
        }).click(function () {
            if (!$(this).hasClass('active')) { //cards which have not been turned already
                $(this).toggleClass('active');
                if (previousChecking) { //previousChecking is a copy of the element being clicked on (this) from the previous iteration. If is set, then go ahead and check if the element clicked on now matches the previous one, and afterwards empty it. If not, just assign to this variable the current object (this)
                    var src = $(this).find('img').attr('src'),
                        src1 = previousChecking.find('img').attr('src'),
                        saveThis = $(this),
                        savePreviousChecking = $.extend( {}, previousChecking );
                    if (src != src1) {
                        setTimeout(function(){
                            saveThis.effect( "shake" );
                            savePreviousChecking.effect( "shake" );
                        }, 1000); //wait 1 second until the card has flipped
                        setTimeout(function(){
                            saveThis.toggleClass('active');
                            savePreviousChecking.toggleClass('active');
                        }, 1500); //afterwards, remove active class, so that they flip back the way they were before being clicked on
                    } else {
                        //Do things when you guess right
                        total += 1;
                        setTimeout(function(){
                            rotateDiv(saveThis);
                            rotateDiv(savePreviousChecking);
                        }, 1000);
                        if (total === 8) { // 8 is the number of matched cards
                            clearInterval(countingTime);
                            countingTime = false;
                            var moves = $('#moves').html();
                            var amountTime = $('#timer').html();
                            winGame(moves,amountTime);
                        }   
                    }
                    previousChecking = '';
                    addMove();
                }else{
                    previousChecking = $(this);
                }
            }
        });
        $('#restart').click(function(){ //activate restart div
            $('#dialog').dialog('open');
        }).prev().click(function(){ //activate saving div
            if (!previousChecking) {
                $('#saving').dialog('open');
            } else {
                alert('Please, end your current move and try again!')
            }
        }).end().next().click(function(){ //activate resume saved game div
            if (localStorage.getItem("game") !== null) {
                var total = parseInt(localStorage.getItem("total"));
                $('#square').html(localStorage.getItem("game"));
                clearInterval(countingTime);
                countingTime = false;
                startGame(total);
                $('#timer').html(localStorage.getItem("time"));
                $('#moves').html(localStorage.getItem("moves"));
                $('#rating').html(localStorage.getItem("rating"));
            } else {
                alert('You don\'t have any game saved yet');
            }
        });
    }
    function winGame(moves,amountTime) {
        //Put a brief text into the modal after completing the game, with the number of moves and time.
        moves = moves.split(' ');
        moves = (parseInt(moves[0]) + 1) + ' moves';
        var html = "Congratulations, you've won the game with " + moves + ". It took you " + amountTime + " to complete the game. Do you want to play one more time?</p>";
        $('#winning').find('p').html(html).end().dialog('open');
    }
    var cards = ['Baseball','Basketball','Golf','Running','Skiing','Soccer','Volleyball','Yoga'],
        cards = fillArray(cards, 2), // 2 is the second argument, so I duplicate the elements in the array passed in
        total = 0;
    $('#square').html(buildSquare(4,cards)); // 4 is the number of cards per side of the square
    startGame(total);
});
