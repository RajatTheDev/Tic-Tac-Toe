function gameBoard () {
    const cells = Array(9).fill(null);
    return {
        getBoard() {
            console.log(cells)
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

    function getBoardSate() {
        return board.getBoard()
    }

    function playTurn(index) {
        const move = board.placeMark(index, currentPlayer.getMark())
        if(!move) {
            console.log("Try again, cell is taken!");
            playerTurn();
            return
        } else {
            getBoardSate()
            switchTurn();
            playerTurn();
        }
    }

    function restartGame() {
        console.log("Resetting the Game....")
        return board.resetBoard();
    }

    return {
        playRound: playTurn,
        showTurn: playerTurn,
        displayBoard: getBoardSate,
        restart: restartGame,
    };
}

const game = gameController();
game.displayBoard();     // Show Board values
game.showTurn();         // Start the game
game.playRound(0);       // Player 1 plays
game.playRound(0);       // Invalid, cell occupied
game.playRound(1);       // Player 2 plays
game.restart();          // Reset Board
game.displayBoard();     // Show Board values