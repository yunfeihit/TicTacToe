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

    //Basic elements - Define the Combo to check whin or loose
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

    
    //Return Function: the 'Getter'
    const getBoard = () => board;

    //Return Function: the log
    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    }

    //Return Function: the 'Setter' 
    // (simple setter,without judging whether the cell is full)
    const placeMark = (row, column, token) => {
        board[row][column].addToken(token);
    }

    //Return Function: isCellEmpty
    // (Judge whether the cell is empty, return true/false)
    const isCellFull = (row, column) => {
        if (board[row][column].getValue()) {
            return true;
        } else {
            return false;
        }
    }

    return {
        getBoard,
        printBoard,
        placeMark,
        isCellFull,
        winCheckCombos,
    }
}

//Create GameController
function GameController (
    playerName = 'Gamer',
) {

    //Basic elements

    //initial board
    const board = GameBoard();
    
    const players = [
        {
            name: playerName,
            token: 1
        },
        {
            name: 'AI',
            token: 2
        }
    ];

    let activePlayer = players[0];

    //Inner Function: 'switchPlayerTurn'
    const switchPlayerTurn = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    //Inner Function: 'logPresentRound'
    const logPresentRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
        board.printBoard();
    };

    //Inner Function: 'returnWinnerToken'
    //(return winner's token. if no winner, return 0)
    const returnWinnerToken = () => {
        //(define the callback method to find an array has 3 consistent elements)
        const findWinCombos = (arrayHas3Element) => {
            const ifAll1 = arrayHas3Element.every(element => element.getValue() === 1);
            const ifAll2 = arrayHas3Element.every(element => element.getValue() === 2);
            if (ifAll1 || ifAll2) {
                return true;
            } else {
                return false;
            }
        };

        const winnerCombo = board.winCheckCombos.find(element => findWinCombos(element));

        if (!winnerCombo) return 0;

        //(if winnerCombo exist, any value is the winner's token)
        return winnerCombo[0].getValue();
    }

    //Return Function: 'getActivePlayer'
    const getActivePlayer = () => activePlayer;

    //Inner Function: 'pseudoAIMove'
    const pseudoAIMove = () => { 

        //1. Inner Method to find the Combo that the AI with last move to win, like [2, 2, 0]
        const if2_2_0 = (array3Els) => 
            array3Els.filter(el => el.getValue() === 2).length === 2 &&
            array3Els.filter(el => el.getValue() === 0).length === 1;

        //2. Inner Method to find the Combo that the Gamer with last move to win, like [1,1,0]
        const if1_1_0 = (array3Els) => 
            array3Els.filter(el => el.getValue() === 1).length === 2 &&
            array3Els.filter(el => el.getValue() === 0).length === 1;

        const winMoveCombo = board.winCheckCombos.find(els => if2_2_0(els));
        const blockMoveCombo = board.winCheckCombos.find(els => if1_1_0(els));

        //3. if above two conditions don't exist, find ramdom empty cell and place into it.      
        const theMovePlace = winMoveCombo  
            ? winMoveCombo.find(el => el.getValue() === 0) 
            : blockMoveCombo  
                ? blockMoveCombo.find(el => el.getValue() === 0) 
                : board.getBoard().flat().find(el => el.getValue() === 0);
        
        //(It's a Cell object is returned, like 'board[1][2]', which equal to a Cell object, Cell.row=1, Cell.column=2)
        return theMovePlace;
    }


    //MAIN FUNTION!
    //Return Function: 'playRound' 
    // (place mark, print round, switch turn)
    const gamerPlayRound = (row, column) => {

        //1. if the place is not empty, place the Mark
        if (board.isCellFull(row, column)) {
            console.log('You are not placing into an empty cell!!')
            return;
        } else {
            board.placeMark(row, column, getActivePlayer().token);
        }

        //2. judge whether there is a winner##
        const winnerToken = returnWinnerToken();

        if (winnerToken === 1) {
            console.log(`Winner is ${playerName}!`);
            board.printBoard();
            return;
        } else if (winnerToken === 2) {
            console.log(`Winner is AI!`);
            board.printBoard();
            return;
        }

        //3. log the move and print the board
        logPresentRound();   
    
        //4. switch user
        switchPlayerTurn(); 

        //5. AI make the move
        const theAIMove = pseudoAIMove();
        board.placeMark(theAIMove.row, theAIMove.column, 2)
     
        //6. judge whether there is a winner##
        const winnerTokenAfterAIMove = returnWinnerToken();

        if (winnerTokenAfterAIMove === 1) {
            console.log(`Winner is ${playerName}!`);
            board.printBoard();
            return;
        } else if (winnerTokenAfterAIMove === 2) {
            console.log(`Winner is AI!`);
            board.printBoard();
            return;
        }

        //7. log the move and print the board
        logPresentRound();   

        //8. switch user
        switchPlayerTurn(); 

        };

    return {
        gamerPlayRound,
        getActivePlayer
    }
}

const game = GameController();