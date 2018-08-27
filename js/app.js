var deck = document.querySelector('.deck');
var listOfCards = document.querySelectorAll('.card');
var listOfSymbols = document.querySelectorAll('.symbol');
var timer = document.querySelector('.timer');
var reset = document.querySelector('.reset');
var moves = document.querySelector('.moves');
var stars = document.querySelectorAll('.fa-star');
var mask = document.getElementById('mask');
var restart = document.getElementById('new-game');
var minute = 0;
var second = 0;
var totalSecond = 0;
var currentFlips = 0;
var currentMoves = 0;
var starMeasure = 3;
var plural = ['', 's'];
var openedCards = 0;
var openArray = new Array();
var gameWon = false;

// Initialization.
var interval;
startNewGame();

deck.addEventListener('click', cardClick, true);
reset.addEventListener('click', startNewGame);

function startNewGame() {
    window.clearInterval(interval);
    gameWon = false;
    // Reset & shuffle the cards.
    var newGame = new Array();
    timer.innerText = '0 min 0 sec';
    moves.innerText = '0';
    for (let i = 0; i < listOfCards.length; i++) {
        listOfCards[i].className = 'card';
        newGame.push(listOfSymbols[i].className);
    }
    shuffle(newGame);
    for (let j = 0; j < listOfCards.length; j++) {
        listOfSymbols[j].className = newGame[j];
    }
    // Reset the score panel.
    minute = 0;
    second = 0;
    totalSecond = 0;
    currentFlips = 0;
    currentMoves = 0;
    for (let k = 0; k < stars.length; k++) {
        stars[k].style.cssText = '-webkit-text-stroke: 1px;';
    }
    openArray = [];
    openedCards = 0;
    plural = ['', 's'];
    interval = window.setInterval(gameTimer, 1000);
}

// The 'shuffle' function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function gameTimer() {
    if (gameWon == true) {
        window.clearInterval(interval);
    } else {
        totalSecond += 1;
        minute = Math.floor(totalSecond / 60);
        second = totalSecond % 60;
        timer.innerText = minute + ' min ' + second + ' sec';
    }
}

function cardClick(event) {
    console.log(event);
    if (event.target.nodeName === "LI") {
        var currentCard = event.target;
    } else if (event.target.nodeName === "I") {
        var currentCard = event.target.parentElement;
    }
        flipCard(currentCard);
        // Update the score panel.
        movesAndStars();
}

function flipCard(card) {
    // A card can only be flipped when it is either unrevealed or unpaired(flip back).
    // Already matched cards cannot be flipped anymore.
    if (card.classList.contains('match')) {} else {
        currentFlips++;
        currentMoves += 0.5;
        card.classList.toggle('open');
        card.classList.toggle('show');
        flipAnimation(card);
        setTimeout(function pushCard() {
            card.classList.remove('flip-card');
            if (card.classList.contains('open')) {
                openArray.push(card);
            } else {
                openArray = [];
            }
            compare();
        }, 500);
    }
}

function flipAnimation(card) {
    card.classList.add('flip-card');
    //The mask prevents clicking while the animation is playing.
    mask.style.display = 'block';
    setTimeout(function pushCard() {
        card.classList.remove('flip-card');
        mask.style.display = 'none';
    }, 500);
}

// Compare two cards.
function compare() {
    if (openArray.length == 2) {
        if (openArray[0].children[0].className == openArray[1].children[0].className) {
            match(openArray);
        } else {
            noMatch(openArray);
        }
        openArray = [];
    }
}

//Play 'match' animation, fix the 'matched' state.
function match(array) {
    array[0].classList.add('match');
    array[1].classList.add('match');
    openedCards += 2;
    // Alert when a game is won. Set a timeout to wait for the last 'matched' animation.
    if (openedCards == 16) {
        console.log('won');
        setTimeout(function() {won();}, 1500);
    }
}

//Play 'unmatch' animation, cover the unmatched cards back.
function noMatch(array) {
    for(let i in array) {
        array[i].classList.add('no-match');
        setTimeout(function removeClasses() {
            array[i].classList.remove('open', 'show', 'no-match');
            flipAnimation(array[i]);
        }, 700);
    }
}

function movesAndStars() {
    moves.innerText = String(Math.floor(currentMoves));
    // Minus one star over 24 flips; minus two stars over 32 flips; no star over 40 flips.
    if (currentFlips < 25) {} else {
        starMeasure = 3 - Math.floor((currentFlips - 17) / 8);
        if (starMeasure < 0) {starMeasure = 0;}
        stars[starMeasure].style.cssText = 'color: white; -webkit-text-stroke: 1px black;';
    }
}

function won() {
    gameWon = true;
    // Check plural for 'star' and 'minute'.
    if (minute > 1) {
        plural[0] = 's';
    }
    if (starMeasure <= 1) {
        plural[1] = '';
    }
    // Alert animation from https://sweetalert2.github.io
    swal({
        title: 'Congratulations!!',
        type: 'success',
        text: 'You have won the game in ' + minute + ' minute' + plural[0] + ' ' + second + ' seconds, with ' + currentMoves + ' moves and ' + starMeasure + ' star' + plural[1] + '!',
        confirmButtonText: 'Restart'
    }).then((result) => {
        if (result.value) {
            startNewGame();
        }
    });
}
