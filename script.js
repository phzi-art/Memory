const gameBoard = document.getElementById("gameBoard");
const resetIcon = document.getElementById("reset-icon");
const restartButton = document.getElementById("restart-button");
const victoryMessage = document.getElementById("victory-message");

const cardsArray = [
  "bild1.jpg", "bild2.jpg", "bild3.jpg", "bild4.jpg",
  "bild5.jpg", "bild6.jpg", "bild7.jpg", "bild8.jpg"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

// Spiel zurücksetzen
function resetGame() {
  gameBoard.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  victoryMessage.classList.remove("show");
  createBoard();
}

// Karten mischen
function shuffle(array) {
  return [...array, ...array].sort(() => 0.5 - Math.random());
}

// Spielfeld aufbauen
function createBoard() {
  const shuffled = shuffle(cardsArray);
  shuffled.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    const img = document.createElement("img");
    img.src = `img/${imgSrc}`;
    img.alt = "Bild";
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    gameBoard.appendChild(card);

    card.addEventListener("click", () => flipCard(card));
  });
}

// Karten umdrehen
function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const firstImg = firstCard.querySelector(".card-back img").src;
  const secondImg = secondCard.querySelector(".card-back img").src;

  if (firstImg === secondImg) {
    // Verzögerung: Beide Karten erst komplett sichtbar, dann Glow
    setTimeout(() => {
      firstCard.classList.add("correct");
      secondCard.classList.add("correct");
      matchedPairs++;
      resetFlippedCards();

      // Siegmeldung mit kleinem Delay
      if (matchedPairs === cardsArray.length) {
        setTimeout(() => {
          victoryMessage.classList.add("show");
        }, 600);
      }
    }, 300);
  } else {
    // Falsches Paar – Karten nach kurzer Zeit zurückflippen
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlippedCards();
    }, 800);
  }
}

// Karten-Status zurücksetzen
function resetFlippedCards() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Events
resetIcon.addEventListener("click", resetGame);
restartButton.addEventListener("click", resetGame);

// Spiel starten
createBoard();
