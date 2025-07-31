const Gameboard = function() {

    const cross = 'X';
    const circle = 'O';
    const empty = '_';

    let currentSymbol = cross;

    let board = Array(3).fill(empty).map(()=> Array(3).fill(empty));

    const toggleSymbol = () => currentSymbol = currentSymbol === cross? circle : cross;

    const fillSpace = (row, column) => {
        board[row][column] = currentSymbol;
        toggleSymbol();
        let isVictory = checkForWin(row, column);

        if(isVictory)
            console.log("Victory!");
    }

    const checkForWin = (row, column) =>
    {
        let symbol = board[row][column];

        let isRowVictory = true;
        let isColumnVictory = true;

        //TODO: implement
        //let isDiagonalVictory = true;

        for(let i = 0; i<board.length; i++)
        {
            if(board[row][i] !== symbol)
                isRowVictory = false;

            if(i === column)
            {
                let columnArr = board[i];
                for(let j = 0; j < columnArr.length; j++)
                {
                    if(columnArr[j] !== symbol)
                        isColumnVictory = false;
                }
            }
        }

        return isRowVictory || isColumnVictory;
    }

    const clear = () =>
    {
        for(let i of board)
            for(let j of board)
        {
            board[i,j] = empty;
        };
    };
    
    return {fillSpace, clear};
};

const myBoard = Gameboard();
