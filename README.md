# Memory card game

## Files

- index.html
- README.md
- script.js
- style.css

## How the game works

When the DOM is ready, after creating an array with the cards to be dealt, the startGame function is executed, filling in the #square div with the cards randomly, and setting up event listeners, so that when the player clicks on a card, it flips revealing its underside. The flip process is carried out through css using transform and transition properties, based on the findings from https://stackoverflow.com/questions/16274030/jquery-function-to-flip-an-image-on-click. When the next card is clicked on, it flips and, if they match, they rotate 360º. If they don't, they shake and flip back to the way they were before being clicked on. This is accomplished through the logic inserted in the startGame function, into the event listener of the card divs.

Every time the player guesses right, a unit is added to a variable named total, which serves as a way to tell the logic when the game is over. When total reaches 8, the game is over, since the user has already guessed all of the cards. At this moment, a modal pops up stating the time and moves it took the user to finish the game and asking the user to restart the game.

Every time the player tries to guess a couple of cards, a move is added to the count of moves, and is displayed at the top of the page, along with the time and a rating system, which consists of three stars, and when the user reaches ten moves, the star rating is brought down to 2 stars, and when the player reaches 20 moves, then is downgraded to 1 star.