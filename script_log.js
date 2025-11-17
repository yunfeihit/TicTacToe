//Create Cell
function Cell(row, column) {
    let value = 0;

    const addToken = (player) => value = player;

    const getValue = () => value;

    return {
        row,
        column,
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
            board[i][j] = Cell(i, j);
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
    //(check and return winner's token. if no winner, return 0)
    const returnWinnerToken = () => {
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

    //Inner Function: 'pseudoAIMove'
    const pseudoAIMove = () => { 

        //1. Method to find the Combo that the AI with last move to win, like [2, 2, 0]
        const if2_2_0 = (array3Els) => 
            array3Els.filter(el => el.getValue() === 2).length === 2 &&
            array3Els.filter(el => el.getValue() === 0).length === 1;

        //2. Method to find the Combo that the Gamer with last move to win, like [1,1,0]
        const if1_1_0 = (array3Els) => 
            array3Els.filter(el => el.getValue() === 1).length === 2 &&
            array3Els.filter(el => el.getValue() === 0).length === 1;

        //3. if above two conditions don't exist, find ramdom empty cell and place into it.

        const winMoveCombo = board.winCheckCombos.find(els => if2_2_0(els));
        const blockMoveCombo = board.winCheckCombos.find(els => if1_1_0(els));
        
        const theMovePlace = winMoveCombo  
            ? winMoveCombo.find(el => el.getValue() === 0) 
            : blockMoveCombo  
                ? blockMoveCombo.find(el => el.getValue() === 0) 
                : board.getBoard().flat().find(el => el.getValue() === 0);
        
        return theMovePlace
    }


    //MAIN FUNTION!
    //Return Function: 'playRound' (place mark, print round, switch turn)
    const gamerPlayRound = (row, column) => {

        //1. if the place is not empty, place the Mark
        if (!board.isEmptyCell(row, column)) {
            console.log('You are not placing into an empty cell!!')
            return;
        } else {
            board.placeMark(row, column, getActivePlayer().token);
        }

        //2. judge whether there is a winner##
        const winnerToken = returnWinnerToken();

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

        //5. AI make the move
        const theAIMove = pseudoAIMove();
        board.placeMark(theAIMove.row, theAIMove.column, 2)
     
        //6. judge whether there is a winner##
        const winnerTokenAfterAIMove = returnWinnerToken();

        if (winnerTokenAfterAIMove === 1) {
            console.log(`Winner is ${playerOneName}!`);
            board.printBoard();
            return;
        } else if (winnerTokenAfterAIMove === 2) {
            console.log(`Winner is ${playerTwoName}!`);
            board.printBoard();
            return;
        }

        //7. log the move and print the board
        printPresentRound();   

        //8. switch user
        switchPlayerTurn(); 

        };

    return {
        gamerPlayRound,
        getActivePlayer
    }
}

const game = GameController();