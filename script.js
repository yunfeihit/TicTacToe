//Create Cell
function Cell() {
    let value = 0;

    const addToken = (player) => value = player;

    const getValue = () => value;

    return {
        addToken,
        getValue
    }
}


//Create GameBoard
function GameBoard() {
    //Basic elements
    let board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }
    
    //The 'Getter'
    const getBoard = () => board;

    //Log
    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    }

    //The 'Setter'
    const placeMark = (row, column, player) => {
        if(!board[row][column].getValue()) {
        board[row][column].addToken(player);
        }
    }

    return {
        getBoard,
        printBoard,
        placeMark
    }
}

//Create GameController
function GameController (
    playerOneName = 'Gamer',
    playerTwoName = 'AI'
) {

    //Basic elements
    const board = GameBoard();
    
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    //Inner Function: 'printNewRound'
    const printPresentRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
        board.printBoard();
    };

    //Return Function: 'getActivePlayer'
    const getActivePlayer = () => activePlayer;

    //Return Function: 'playRound'
    const playRound = (row, column) => {
        //place mark
        board.placeMark(row, column, getActivePlayer().token);
        //switch user
        printPresentRound();   
        switchPlayerTurn(); 
    };

    return {
        playRound,
        getActivePlayer
    }
}

const game = GameController();