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
    const moveSound = new Audio("./sounds/moveSound.wav");
    const winSound = new Audio("./sounds/winSound.wav");
    const drawSound = new Audio("./sounds/drawSound.wav");

    const newGame = (name1, name2) => {
        gameBoard.resetBoard();
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
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

    const resetGame = () => {
        winSound.pause();
        drawSound.pause();
        winSound.currentTime = 0;
        drawSound.currentTime = 0;
        gameRunning = true;
        currentPlayer = player1;
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
                winSound.currentTime = 0;
                winSound.play();

                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
    });
                return;
            }
        }

        if (boardState.every(cell => cell !== null)) {
            gameRunning = false;
            displayController.updateStatusMessage("It's a draw! No one wins this round. 🤝");
            drawSound.currentTime = 0;
            drawSound.play();
            return;
        }
    }

    const playRound = (index) => {

        moveSound.currentTime = 0;
        moveSound.play();
        
        if (!gameRunning) {
            return false;
        }

        const move = gameBoard.placeMark(index, currentPlayer.getMark());
        if (!move) {
            return false;
        }

        displayController.renderBoard();
        checkWinner();

        if (gameRunning) {
            switchTurn();
            showTurn();
        }
        return true;
    }

    return {
        newGame,
        playRound,
        showTurn,
        resetGame,
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
            } else if (mark === "O") {
                cell.classList.add("o-mark");
            }
        });
    };


    uiCells.forEach(function(cell) {
        cell.addEventListener('click', function () {
            if (!gameController.isGameRunning()) {
                cell.classList.add('shake');
                setTimeout(() => cell.classList.remove('shake'), 300);
                return;
            }

        const cellIndex = parseInt(this.getAttribute('data-index'));
        const moveSuccess = gameController.playRound(cellIndex);

        if (!moveSuccess) {
            cell.classList.add('shake');
            setTimeout(() => cell.classList.remove('shake'), 300);
        }
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
        gameController.resetGame();
        displayController.renderBoard();
        displayController.updateStatusMessage("Game restarted! X's turn.");
    });

    const newGameButton = document.getElementById("newGame-button");
    newGameButton.addEventListener("click", function() {
        gameController.resetGame();
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
