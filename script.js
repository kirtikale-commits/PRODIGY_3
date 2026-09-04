// ========================================
// SELECT ELEMENTS
// ========================================

const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restartBtn");

const playerModeBtn = document.getElementById("playerMode");

const aiModeBtn = document.getElementById("aiMode");

const scoreXElement = document.getElementById("scoreX");

const scoreOElement = document.getElementById("scoreO");

const scoreDrawElement = document.getElementById("scoreDraw");


// ========================================
// GAME VARIABLES
// ========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let currentPlayer = "X";

let gameActive = true;

let vsAI = false;


let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// ========================================
// CELL CLICK
// ========================================

cells.forEach(function (cell) {

    cell.addEventListener("click", function () {

        const index = Number(
            cell.getAttribute("data-index")
        );


        // Don't allow clicking occupied cells
        if (board[index] !== "" || !gameActive) {
            return;
        }


        // Don't allow player to click during AI turn
        if (vsAI && currentPlayer === "O") {
            return;
        }


        makeMove(index, currentPlayer);


        if (gameActive && vsAI && currentPlayer === "O") {

            setTimeout(function () {

                aiMove();

            }, 500);

        }

    });

});


// ========================================
// MAKE MOVE
// ========================================

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );


    const result = checkWinner();


    if (result) {

        endGame(result);

        return;
    }


    // Switch player
    currentPlayer =
        currentPlayer === "X" ? "O" : "X";


    updateStatus();
}


// ========================================
// CHECK WINNER
// ========================================

function checkWinner() {

    for (let pattern of winningPatterns) {

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                pattern: pattern
            };

        }

    }


    // Check draw
    if (!board.includes("")) {
        return {
            winner: "draw",
            pattern: []
        };
    }


    return null;
}


// ========================================
// END GAME
// ========================================

function endGame(result) {

    gameActive = false;


    if (result.winner === "draw") {

        statusText.textContent =
            "It's a Draw!";

        scoreDraw++;

        scoreDrawElement.textContent =
            scoreDraw;

        return;
    }


    // Highlight winning cells
    result.pattern.forEach(function (index) {

        cells[index].classList.add("win");

    });


    statusText.textContent =
        `Player ${result.winner} Wins!`;


    if (result.winner === "X") {

        scoreX++;

        scoreXElement.textContent =
            scoreX;

    } else {

        scoreO++;

        scoreOElement.textContent =
            scoreO;

    }
}


// ========================================
// UPDATE STATUS
// ========================================

function updateStatus() {

    if (!gameActive) {
        return;
    }


    if (vsAI && currentPlayer === "O") {

        statusText.textContent =
            "AI is thinking...";

    } else {

        statusText.textContent =
            `Player ${currentPlayer}'s turn`;

    }
}


// ========================================
// AI MOVE
// ========================================

function aiMove() {

    if (!gameActive) {
        return;
    }


    // Find empty cells
    const emptyCells = board
        .map(function (value, index) {

            if (value === "") {
                return index;
            }

            return null;

        })
        .filter(function (index) {

            return index !== null;

        });


    if (emptyCells.length === 0) {
        return;
    }


    // First try to win
    for (let index of emptyCells) {

        board[index] = "O";

        if (checkWinner()) {

            board[index] = "";

            makeMove(index, "O");

            return;
        }

        board[index] = "";
    }


    // Try to block player X
    for (let index of emptyCells) {

        board[index] = "X";

        if (checkWinner()) {

            board[index] = "";

            makeMove(index, "O");

            return;
        }

        board[index] = "";
    }


    // Take center if available
    if (board[4] === "") {

        makeMove(4, "O");

        return;
    }


    // Choose random available position
    const randomIndex =
        emptyCells[
            Math.floor(
                Math.random() * emptyCells.length
            )
        ];


    makeMove(randomIndex, "O");
}


// ========================================
// RESTART GAME
// ========================================

function restartGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(function (cell) {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "win"
        );

    });


    updateStatus();
}


restartBtn.addEventListener(
    "click",
    restartGame
);


// ========================================
// TWO PLAYER MODE
// ========================================

playerModeBtn.addEventListener(
    "click",
    function () {

        vsAI = false;

        playerModeBtn.classList.add("active");

        aiModeBtn.classList.remove("active");

        restartGame();

    }
);


// ========================================
// AI MODE
// ========================================

aiModeBtn.addEventListener(
    "click",
    function () {

        vsAI = true;

        aiModeBtn.classList.add("active");

        playerModeBtn.classList.remove("active");

        restartGame();

    }
);


// ========================================
// INITIAL STATUS
// ========================================

updateStatus();
