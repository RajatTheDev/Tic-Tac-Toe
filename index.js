const gameBoard = (() => {
    const cells = Array(9).fill(null);

    const getBoard = () => {return[...cells]};

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
    let gameRunning = true;
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "0");
    let currentPlayer = player1;
    
    const playerTurn = () => {
        console.log(`${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`);
    }

    const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getBoardState = () => {
        const board = gameBoard.getBoard();
        console.log(board);
        return board;
    }

    const restartGame = () => {
        console.log("Resetting the Game....")
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
                console.log(`Game Over! ${currentPlayer.getName()} wins! 🎉`);
                return;
            }
        }

        if (boardState.every(cell => cell !== null)) {
            gameRunning = false;
            console.log("It's a draw! No one wins this round. 🤝");
            return;
        }
    }

    const playTurn = (index) => {
        if (!gameRunning) {
            console.log("Game is over! Please restart to play again.");
            return;
        }

        const move = gameBoard.placeMark(index, currentPlayer.getMark());
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
}) ();

gameController.displayBoard();    // Show Board values
gameController.showTurn();        // Start the game
gameController.playRound(0);      // Player 1 plays
gameController.playRound(0);      // Invalid, cell occupied
gameController.playRound(1);      // Player 2 plays
gameController.playRound(2);      // Player 1 plays
gameController.playRound(3);      // Player 2 plays
gameController.playRound(4);      // Player 1 plays
gameController.playRound(5);      // Player 2 plays
gameController.playRound(6);      // PLayer 1 won
gameController.playRound(7);      // Tries to play again
gameController.restart();         // Reset Board
gameController.displayBoard();    // Show Board values