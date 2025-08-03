const BoardView = function(gameModel)
{
    let boardCells = document.querySelectorAll(".board-cell");
    let boardRoot = document.querySelector(".board-root");
    let nextBtn = document.querySelector(".restart-round");
    let newGameBtn = document.querySelector(".restart-game");
    let gameStatus = document.querySelector(".status");

    nextBtn.addEventListener("click", () =>
    {
        game.restartRound();
        startNewRound();
    });

    newGameBtn.addEventListener("click", () =>
    {
        game.restartGame();
        startNewRound();
    });

    const game = gameModel;

    const disableBoard = () => {
        boardRoot.classList.add('disabled');
    };

    const enableBoard = () => {
        boardRoot.classList.remove('disabled');
    };

    const clearBoard = () => 
    {
        for(let i = 0; i < boardCells.length; i++)
        {
            boardCells[i].textContent = "";
            boardCells[i].classList.remove('cross');
            boardCells[i].classList.remove('circle');
        }
    }

    const setNextButtonActiive = (isOn) =>
    {
        nextBtn.hidden = !isOn;
    }

    const setNewGameButtonActiive = (isOn) =>
    {
        newGameBtn.hidden = !isOn;
    }

    const startNewRound = () => 
    {
        setNextButtonActiive(false);
        setNewGameButtonActiive(false);
        gameStatus.textContent = "";

        enableBoard();
        clearBoard();
    }

    for(let i = 0; i < boardCells.length; i++)
    {
        boardCells[i].addEventListener("click", () =>
        {
            if(game.isRoundComplete() || game.isGameComplete() || boardCells[i].textContent)
                return;

            const currentSymbol = game.getCurrentSymbol();
            boardCells[i].textContent = currentSymbol;
            boardCells[i].classList.add(currentSymbol === 'X'? 'cross' : 'circle'); //not an ideal soution, might refactor later
            
            let result = game.playerInput(Math.floor(i / 3), i % 3);

            if(game.isRoundComplete() || game.isGameComplete())
            {
                disableBoard();

                let isGameOver = game.isGameComplete();

                setNewGameButtonActiive(isGameOver);
                setNextButtonActiive(!isGameOver);
            }

            gameStatus.textContent = result;
        });
    }

    const getCell = (row, column) => {
        return boardCells[row * 3 + column];
    };

    startNewRound();

    return { disableBoard, enableBoard, getCell };
}

const game = Game(3);
const boardView = BoardView(game);