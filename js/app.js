// Create a Timer object / learned from: https://www.youtube.com/watch?v=jRhB1IG7uAw tutorial

function Timer(element) {
let time = 0;
let interval;
let offset;

function update(){
    time += delta();
    let formattedTime = timeFormatter(time);
    element.textContent= formattedTime ;
};
function delta(){ // Time passed 
    let now = Date.now();
    let timePassed = now - offset;
    offset = now;
    return timePassed;
}; 
function timeFormatter(timeinMilliseconds){
    let time = new Date(timeinMilliseconds); 
    let minutes = time.getMinutes().toString();
    let seconds = time.getSeconds().toString();
    //var milliseconds = time.getMilliseconds().toString(); - We don't need to measure miliSeconds here

    if (minutes.length <2 ){
        minutes = '0' + minutes; 
    }

    if (seconds.length <2 ){
        seconds = '0' + seconds; 
    }
    
    // while (milliseconds.length <3 ){
    //     milliseconds = '0' + milliseconds; 
    // }
    return minutes + ' : ' + seconds ; //+ ' . ' + milliseconds

};

this.isOn = false;

this.start = function() {
    if (!this.isOn) {
        interval = setInterval(update,10);
        offset = Date.now();
        this.isOn = true;
    }

this.stop = function(){
    if (this.isOn){
        clearInterval(interval);
        interval=null;
        this.isOn = false;
    }
};

this.reset = function(){
    time = 0;
}

}

}

let timer = document.querySelector(".timer");

let watch = new Timer(timer);

// Setup Modal window to display

let modal = document.getElementById('WinModal');

let results = document.querySelector(".results");

let closeBtn = document.getElementsByClassName("close")[0];

let replayBtn = document.querySelector(".replayBtn");

replayBtn.onclick = function(){  
    restartGame() ;
    modal.style.display = "none";

}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Create a list that holds all of the cards


let card_list = ["fa fa-diamond","fa fa-paper-plane-o","fa fa-bolt","fa fa-cube","fa fa-anchor","fa fa-leaf","fa fa-bicycle","fa fa-bomb"]; // Array with 8 uniqe card symbols

card_list.push(...card_list); // doubling the array so we have 16 cards in total

const cardContainer = document.querySelector(".deck");

let openedCards = [];
let matchedCards = [];


// Initialize the game / Create all cards and shuffle them


function init(){
    shuffle(card_list);
    for (let i=0 ; i<card_list.length ; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.innerHTML = `<i class="${card_list[i]}"></i>`;
        cardContainer.appendChild(card);
        // Add Click event to the cards
        click(card);
    }
    //Start the Timer
    watch.start();
}

// Shuffle function from http://stackoverflow.com/a/2450976
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

// Click event for card

function click(card){

    card.addEventListener("click", function(){

        if(openedCards.length === 1){
        // 1 Card is open
            card.classList.add("open","show","disabled");
            openedCards.push(this);
            
            compare(openedCards[1],openedCards[0]);
            
        }else{
            // No cards are open
            card.classList.add("open","show","disabled");
            openedCards.push(this);
    
        }

    });
}

// Compare 2 Cards

function compare(currCard,prevCard){

    // Comparing 
    if (currCard.innerHTML === prevCard.innerHTML){ // if this.innerHTML === openedCards[1].innerHTML
        //Matched
        currCard.classList.add("match");
        prevCard.classList.add("match");
            matchedCards.push(prevCard,currCard);
            openedCards = [];

            //Is the game over ? CHECK
            setTimeout(isOver,0);
        }else {
            //Not Matched
            //Wait 500ms then do functions;
            setTimeout(function(){
                currCard.classList.remove("open","show","disabled");
                prevCard.classList.remove("open","show","disabled");
                
            }, 500);
            openedCards = [];
        }
    // Add Move 
    addMove();
}

// Check if the game is over

function isOver() {
    if (matchedCards.length === card_list.length) {
        watch.stop();
        results.innerHTML = `You've won with ${moves} moves. Your time: ${timer.textContent} . Your rating: ${starNumber} stars.`;
        modal.style.display = "block";

    }
}

// Add Move
let moves = 0;
const movesContainer = document.querySelector(".moves");
movesContainer.innerHTML = moves;

function addMove(){
    moves ++;
    movesContainer.innerHTML=moves;
    rating();
}

// Reset the game

const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click",restartGame);

function restartGame(){
      // delete cards
      cardContainer.innerHTML = "";
      
      
      // create cards
      init();
      // reset values
      watch.reset();
      matchedCards= [];
      openedCards = [];

      moves = 0;
      movesContainer.innerHTML = moves;
      starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
              <li><i class="fa fa-star"></i></li>
              <li><i class="fa fa-star"></i></li>`
}

// Rating system

let starNumber = 3; 

const starsContainer = document.querySelector(".stars");

function rating() {

    switch (moves){
        case 18: 
            starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>` ;
            starNumber = 2; 
        break;

        case 25: 
            starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>` ;
            starNumber = 1; 
        break;

    }
}

// Start the game for the first time 

init();