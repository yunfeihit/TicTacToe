//////////////////Global Variables///////////////////////
const resultDisplay = document.querySelector('#result');
const boardDisplay = document.querySelector('#game-board');
const gameProgress = GameController();



//////////////////Add EventListener On the grid///////////////////////
//(everytime click on one of the grid, play one round)
for (let i = 0; i < 3; i++) {
    for (let j = 0; j< 3; j++) {
        const gridItem = document.querySelector(`#board${i}${j}`);
        gridItem.addEventListener('click', () => gameProgress.playOneRound(i, j))
    }
}


//////////////////Define Functions and Closures///////////////////////
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
            //(put Cell in it)
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

    //Return Function: show the board
    const showBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const gridItem = document.querySelector(`#board${i}${j}`);
                if (board[i][j].getValue() === 2) {
                    gridItem.innerHTML = '<img src="imgs/close_50_white.svg" alt="x">'
                } else if (board[i][j].getValue() === 1) {
                    gridItem.innerHTML = '<img src="imgs/circle_50_white.svg" alt="O">'
                }              
            }
        }
    }

    //Return Function: the 'Setter' 
    // (simple setter,without judging whether the cell is full)
    const placeMark = (row, column, token) => {
        board[row][column].addToken(token);
    }

    //Return Function: isCellFull
    // (Judge whether the cell is full, return true/false)
    const isCellFull = (row, column) => {
        if (board[row][column].getValue()) {
            return true;
        } else {
            return false;
        }
    }

    return {
        getBoard,
        showBoard,
        placeMark,
        isCellFull,
        winCheckCombos,
    }
}

//Create GameController
function GameController (
    playerName = 'You',
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

    // (list all empty cells in a flat array first)
    const emptyCellsArray = board.getBoard().flat().filter(el => el.getValue() === 0)  

    //Inner Function: 'showPresentRound'
    const showPresentRound = () => {
        board.showBoard();
    };

    //Return Function: 'getActivePlayer'
    const getActivePlayer = () => activePlayer;

    //Inner Function: 'getPseudoAIMove'
    //(get the present board, return the pseudo AI move place: Cell / board[x][x])
    const getPseudoAIMove = () => { 

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
                : emptyCellsArray[Math.floor(Math.random() * emptyCellsArray.length)];
        
        //(It's a Cell object is returned, like 'board[1][2]', which equal to a Cell object, Cell.row=1, Cell.column=2)
        return theMovePlace;
    }

    //Inner Function: 'returnWinnerToken'
    //(get the present board, check if there is a winner, return winner's token 1(gamer) or 2(AI) . if no winner, return 0)
    const returnWinnerToken = () => {
        //(first: define the callback method to find an array has 3 consistent elements)
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

    //Inner Function: checkWin
    //(check if the game has a winner)
    const checkWin = () => {
        console.log('running checkwin()....')


        //get the winner token: 1 or 2 or 0(no winner)
        const winnerToken = returnWinnerToken();
        //define initial game function(ready to play a new round)
        const initialGame = () => {
            console.log('game is initialed')
            resultDisplay.textContent = "";

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const gridItem = document.querySelector(`#board${i}${j}`);
                    gridItem.innerHTML = "";
                    //'board' is initialed in the closure of 'GameController', but 'board' means an object instead of the array, if you want to use the array of board, you should use 'board.getBoard'
                    const boardArray = board.getBoard();
                    boardArray[i][j].addToken(0);
                }
            }

        }
        // run the code: 
        if (winnerToken === 1) {
            console.log('winner is gamer, find the winner token, about to show the result....')

            resultDisplay.textContent = `You beat the AI!`;
            //add a onetime eventListener which can clear the board and the result display, so after there is an winner, if you click the board, the board will initial
            setTimeout(() => {
                boardDisplay.addEventListener('click', () => initialGame(), {once: true})
            }, 0);
            return true;
        } else if (winnerToken === 2) {
            console.log('winner is AI, find the winner token, about to show the result....')

            resultDisplay.textContent = `Winner is AI!`;
            //same as above
            setTimeout(() => {
                boardDisplay.addEventListener('click', () => initialGame(), {once: true})
            }, 0);            return true;
        } else {
            return false;
        }
    }

    //Inner Function: Tie check
    const ifBoardIsFull = () => {
        if (emptyCellsArray.length === 0) {return true}
        else {return false;}
    }


    //MAIN FUNTION!
    //Return Function: 'playOneRound' 
    //(every time click one of the grid item, play it)
    //(if it's an empty cell, place a token, judge whether there is a winner, reshow the board, switch the turn, let AI make the move, judge whether there is a winner, reshow the board, switch the turn)
    const playOneRound = (row, column) => {

        //1. Place the Gamer's Mark(if the place is not empty)
        if (board.isCellFull(row, column)) {
            return false;
        } else {
            board.placeMark(row, column, 1);
        }

        //2. display the board
        showPresentRound();   

        //3. judge whether there is a winner
        if (checkWin()) return;

        //check if it is a tie
        if (ifBoardIsFull()) {
            resultDisplay.textContent = `It's a tie!`;
            setTimeout(() => {
                boardDisplay.addEventListener('click', () => initialGame(), {once: true})
            }, 0);
            return;
        };

        //5. AI make the move
        const theAIMove = getPseudoAIMove();
        board.placeMark(theAIMove.row, theAIMove.column, 2)

        //6. display the board
        showPresentRound();   
     
        //7. judge whether there is a winner
        if (checkWin()) return;

        //check if it is a tie
        if (ifBoardIsFull()) {
            resultDisplay.textContent = `It's a tie!`;
            setTimeout(() => {
                boardDisplay.addEventListener('click', () => initialGame(), {once: true})
            }, 0);
            return;
        };

        };

    return {
        playOneRound,
        getActivePlayer
    }
}




