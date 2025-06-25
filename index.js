const gameBoard = (() => {
    const cells = Array(9).fill(null);

    const getBoard = () => cells;

    const placeMark = (cellIndex, mark) => {
        if (cells[cellIndex] === null) {
                cells[cellIndex] = mark;
                return true
            } else {
                return false
            }
        };

    const resetBoard =  () => {cells.fill(null)};
        
    return {getBoard, placeMark, resetBoard}
})();

function createPlayer (player, mark) {
    const getName = () => player;
    const getMark = () => mark;
    return { getName, getMark };
}

const gameController = (() => {
    let gameRunning = false;
    let player1, player2, currentPlayer;

    const newGame = (name1, name2) => {
        gameBoard.resetBoard();
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "0");
        currentPlayer = player1;
        gameRunning = true;
        displayController.renderBoard();
        gameController.showTurn();
    };
    
    const showTurn = () => {
        displayController.updateStatusMessage(`${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`);
    }

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const restartGame = () => {
        gameRunning = true;
        return gameBoard.resetBoard();
    }

    const checkWinner = () => {
        const winCombos = [[0,1,2], [3,4,5,], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [1,4,7], [2,5,8]];
        const boardState = gameBoard.getBoard();

        for(let combo of winCombos) {
            const [a, b, c] = combo;

            if (boardState[a] === boardState[b] && boardState[a] === boardState[c] && boardState[a] != null) {
                gameRunning = false;
                displayController.updateStatusMessage(`Game Over! ${currentPlayer.getName()} wins! 🎉`);
                return;
            }
        }

        if (boardState.every(cell => cell !== null)) {
            gameRunning = false;
            displayController.updateStatusMessage("It's a draw! No one wins this round. 🤝");
            return;
        }
    }

    const playRound = (index) => {

        const move = gameBoard.placeMark(index, currentPlayer.getMark());
        if (!move) {
            alert("Try again, cell is taken!");
            return;
        }

        displayController.renderBoard();
        checkWinner();

        if (gameRunning) {
            switchTurn();
            showTurn();
        }
    }

    return {
        newGame,
        playRound,
        showTurn,
        restartGame,
        isGameRunning: () => gameRunning,
    };
}) ();

const displayController = (() => {
    const uiCells = document.querySelectorAll(".cell");
    const boardState = gameBoard.getBoard();
    const renderBoard = () => {
        boardState.forEach((mark, index) => {
            const cell = uiCells[index];
            cell.textContent = mark === null ? "" : mark;

            cell.classList.remove("x-mark", "o-mark");

            if (mark === "X") {
                cell.classList.add("x-mark");
            } else if (mark === "0") {
                cell.classList.add("o-mark");
            }
        });
    };


    uiCells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            if (!gameController.isGameRunning()) {
                return;
            }
            const cellIndex = parseInt(this.getAttribute('data-index'));
            gameController.playRound(cellIndex);
        });
    });

    const startScreen = document.querySelector(".start-screen");
    const gameScreen = document.querySelector(".game-screen");
    const form = document.querySelector("form");
    const player1 = document.querySelector(".player1name");
    const player2 = document.querySelector(".player2name");
    const statusMessage = document.getElementById("status-message");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        gameController.newGame(form.elements.player1.value, form.elements.player2.value);
        player1.textContent = form.elements.player1.value;
        player2.textContent = form.elements.player2.value;
        statusMessage.textContent = `${form.elements.player1.value}'s turn (X)`;
        gameScreen.style.display = "flex";
        startScreen.style.display = "none";
    });

    const updateStatusMessage = (message) => {
        statusMessage.textContent = message;
    };

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", function() {
        gameController.restartGame();
        displayController.renderBoard();
        displayController.updateStatusMessage("Game restarted! X's turn.");
    });

    const newGameButton = document.getElementById("newGame-button");
    newGameButton.addEventListener("click", function() {
        form.reset();
        gameScreen.style.display = "none";
        startScreen.style.display = "block";
    });

    return {
        renderBoard,
        updateStatusMessage
    }
}) ();

document.addEventListener("DOMContentLoaded", () => {
    const gameScreen = document.querySelector(".game-screen");
    gameScreen.style.display = "none";
});
