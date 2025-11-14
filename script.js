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

    //Define the Combo to check whin or loose
    const winCheckCombos = [
        //the rows
        [board[0][0],board[0][1],board[0][2]],
        [board[1][0],board[1][1],board[1][2]],
        [board[2][0],board[2][1],board[2][2]],
        //the columns
        [board[0][0],board[1][0],board[2][0]],
        [board[0][1],board[1][1],board[2][1]],
        [board[0][2],board[1][2],board[2][2]],
        //the crosses
        [board[0][0],board[1][1],board[2][2]],
        [board[0][2],board[1][1],board[2][0]]
    ];

    
    //The 'Getter'
    const getBoard = () => board;

    //Log
    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    }

    //The 'Setter' (without judging whether the cell is full)
    const placeMark = (row, column, token) => {
        board[row][column].addToken(token);
    }

    //Judge whether the cell is empty, return true/false
    const isEmptyCell = (row, column) => {
        if (board[row][column].getValue()) {
            return false;
        } else {
            return true;
        }
    }

    return {
        getBoard,
        printBoard,
        placeMark,
        isEmptyCell,
        winCheckCombos,
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

    //Inner Function: 'printPresentRound'
    // (since it should be called automatically in the end of 'playRound', inner function is fine)
    const printPresentRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
        board.printBoard();
    };

    //Inner Function: 'checkWin'
    //It should be used inside of the GameController, so innerFunction
    //(check and return winner's token. if no winner, return 0)
    const checkWin = () => {
        const winCheckCombosInHere = board.winCheckCombos;
        const findWinCombos = (arrayHas3Element) => {
            const ifAll1 = arrayHas3Element.every(element => element.getValue() === 1);
            const ifAll2 = arrayHas3Element.every(element => element.getValue() === 2);
            if (ifAll1 || ifAll2) {
                return true;
            } else {
                return false;
            }
        };
        const winnerCombo = winCheckCombosInHere.find(element => findWinCombos(element));

        if (!winnerCombo) return 0;

        return winnerCombo[0].getValue();
    }

    //Return Function: 'getActivePlayer'
    const getActivePlayer = () => activePlayer;

    //MAIN FUNTION!
    //Return Function: 'playRound' (place mark, print round, switch turn)
    const playRound = (row, column) => {

        //1. place mark (judge whether it is an empty cell)
        if (!board.isEmptyCell(row, column)) {
            console.log('You are not placing into an empty cell!!')
            return;
        } else {
            board.placeMark(row, column, getActivePlayer().token);
        }

        //2. judge whether there is a winner
        const winnerToken = checkWin();
        if (winnerToken === 1) {
            console.log(`Winner is ${playerOneName}!`);
            board.printBoard();
            return;
        } else if (winnerToken === 2) {
            console.log(`Winner is ${playerTwoName}!`);
            board.printBoard();
            return;
        }

        //3. log the move and print the board
        printPresentRound();   
        
        //4. switch user
        switchPlayerTurn(); 
    };

    return {
        playRound,
        getActivePlayer
    }
}

//Create Pseudo AI
function pseudoAIMove ()  {
    const board = GameBoard();
    const winCheckCombos = board.winCheckCombos;

    //1. Method to find if there is the last move to win, like:[2,2,0]
    const ifTwo2One0 = (array3Els) => 
        array3Els.filter(el => el.getValue() === 2).length === 2 &&
        array3Els.filter(el => el.getValue() === 0).length === 1;

    //2. Method to find if the Gamer is almost win, like:[1,1,0]
    const ifTwo1One0 = (array3Els) => 
        array3Els.filter(el => el.getValue() === 1).length === 2 &&
        array3Els.filter(el => el.getValue() === 0).length === 1;

    //3. if above two conditions don't exist, find ramdom empty cell and place into it.

    //return the move coordinate

    const winMoveCombo = winCheckCombos.find(els => ifTwo2One0(els));
    const blockMoveCombo = winCheckCombos.find(els => ifTwo1One0(els));
    
    const theMovePlace = if (winMoveCombo) {
        return 
    }


    const theMoveCombo = winCheckCombos.find(els => ifTwo2One0(els));

    const theMovePlace = theCombo.find(el => el.getValue() === 0);

    return [row, column]
}







const game = GameController();