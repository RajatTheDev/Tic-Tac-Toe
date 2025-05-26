function gameBoard () {
    const cells = Array(9).fill(null);
    return {
        getBoard() {
            return [...cells];
        },
        placeMark(cellIndex, mark) {
            if (cells[cellIndex] === null) {
                cells[cellIndex] = mark;
                return true
            } else {
                return false
            }
        },
        resetBoard() {
            cells.fill(null);
        }
    }
};

function player (player, mark) {
    const playerName = String(prompt(`Enter ${player} name`, `${player}`));
    const playerMark = mark;

    return {
        getName() {
            return playerName;
        },
        getMark() {
            return playerMark;
        }
    }
}

function gameController() {
    const board = gameBoard();
    let gameRunning = true;
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "0");
    let currentPlayer = player1;
    
    function playerTurn() {
        console.log(`${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`);
    }
    
    function switchTurn() {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1
        }
    }
    
    function getBoardState() {
        console.log(board.getBoard());
        return board.getBoard()
    }
    
    function restartGame() {
        console.log("Resetting the Game....")
        gameRunning = true;
        return board.resetBoard();
    }
    
    function checkWinner() {
        const winCombos = [[0,1,2], [3,4,5,], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [1,4,7], [2,5,8]];
        const boardState = board.getBoard();

        for(let combo of winCombos) {
            const [a, b, c] = combo;

            if (boardState[a] === boardState[b] && boardState[a] === boardState[c] && boardState[a] != null) {
                gameRunning = false;
                if (player1.getMark() === boardState[a]) {
                    console.log(`Game Over! ${player1.getName()} wins! 🎉`);
                } else {
                    console.log(`Game Over! ${player2.getName()} wins! 🎉`);
                }
            }
        }

        if (boardState.every(cell => cell !== null)) {
            gameRunning = false;
            console.log("It's a draw! No one wins this round. 🤝");
        }
    }

    function playTurn(index) {
        if (!gameRunning) {
            console.log("Game is over! Please restart to play again.");
            return;
        }

        const move = board.placeMark(index, currentPlayer.getMark());
        if (!move) {
            console.log("Try again, cell is taken!");
            playerTurn();
            return;
        }

        getBoardState();
        checkWinner();

        if (gameRunning) {
            switchTurn();
            playerTurn();
        }
    }

    return {
        playRound: playTurn,
        showTurn: playerTurn,
        displayBoard: getBoardState,
        restart: restartGame,
    };
}

const game = gameController();
game.displayBoard();    // Show Board values
game.showTurn();        // Start the game
game.playRound(0);      // Player 1 plays
game.playRound(0);      // Invalid, cell occupied
game.playRound(1);      // Player 2 plays
game.playRound(2);      // Player 1 plays
game.playRound(3);      // Player 2 plays
game.playRound(4);      // Player 1 plays
game.playRound(5);      // Player 2 plays
game.playRound(6);      // PLayer 1 won
game.playRound(7);      // Tries to play again
game.restart();         // Reset Board
game.displayBoard();    // Show Board values