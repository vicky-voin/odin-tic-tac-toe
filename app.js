const Player = function(goesFirst) {

    let score = 0;
    let nickname = goesFirst? "Player 1" : "Player 2";

    const getScore = () =>
    {
        return score;
    }

    const incrementScore = () => 
    {
        score++;
    }

    const getNickname = () =>
    {
        return nickname;
    }

    const resetScore = () =>
    {
        score = 0;
    }

    return {getScore, incrementScore, resetScore, getNickname};
}

const Game = function(winningScore)
{
    const board = Gameboard();

    const player1 = Player(true);
    const player2 = Player(false);

    let activePlayer = player1;
    let shouldRestart = false;
    let isOver = false;

    const isRoundComplete = () => {return shouldRestart && !isOver;};
    const isGameComplete = () => {return shouldRestart && isOver;};

    const getScoreMessage = () => 
    {
        return "score: " + player1.getScore() + " : " + player2.getScore();
    }

    const playerInput = function(row, column)
    {
        console.log(activePlayer.getNickname() + " plays " + row + ", " + column);
        let result = board.fillSpace(row, column);

        if(result.isVictory)
        {
            activePlayer.incrementScore();
            console.log(activePlayer.getNickname() + " has won this round! " + 
                "CURRENT " + getScoreMessage());

            if(activePlayer.getScore() === winningScore)
            {
                console.log(activePlayer.getNickname() + " has won the game!! " +
                    "FINAL " + getScoreMessage()
                )

                isOver = true;
            }

            shouldRestart = true;
        }
        else if (result.isTie)
        {
            console.log("It's a tie! " + 
                "CURRENT " + getScoreMessage()
            );

            shouldRestart = true;
        }

        activePlayer = activePlayer === player1? player2 : player1;
    }

    const restartGame = () =>
    {
        isOver = false;
        player1.resetScore();
        player2.resetScore();

        restartRound();
    }

    const restartRound = () =>
    {
        board.clear();
        activePlayer = player1;
        shouldRestart = false;
    }

    return {playerInput, restartGame, restartRound, isRoundComplete, isGameComplete};
}

const Gameboard = function() {

    const cross = 'X';
    const circle = 'O';
    const empty = '_';

    const toggleSymbol = () => currentSymbol = currentSymbol === cross? circle : cross;

    const fillSpace = (row, column) => {
        board[row][column] = currentSymbol;
        symbolCount ++;

        let isVictory = checkForWin(row, column);
        let isTie = symbolCount === 9 && !isVictory;
        
        if(isVictory)
            console.log("Victory!");
        else if(isTie)
            console.log("Tie!");
        else
            toggleSymbol();

        return {isVictory, isTie};
    }

    const checkForWin = (row, column) =>
    {
        let symbol = board[row][column];

        let isRowVictory = true;
        let isColumnVictory = true;

        let mainDiagonalWin = true;
        let antiDiagonalWin = true;

        for (let i = 0; i < board.length; i++) {
            if (board[i][i] !== symbol) {
                mainDiagonalWin = false;
            }
            if (board[i][board.length - 1 - i] !== symbol) {
                antiDiagonalWin = false;
            }
        }

        let isDiagonalVictory = mainDiagonalWin || antiDiagonalWin;

        for(let i = 0; i<board.length; i++)
        {
            if(board[row][i] !== symbol)
                isRowVictory = false;

            if(board[i][column] !== symbol)
                isColumnVictory = false;
        }

        return isRowVictory || isColumnVictory || isDiagonalVictory;
    }

    const clear = () =>
    {
        currentSymbol = cross;
        symbolCount = 0;

        board = Array(3).fill(empty).map(()=> Array(3).fill(empty));
    };

    let currentSymbol;
    let symbolCount;
    let board;

    clear();
    
    return {fillSpace, clear};
};

// Test function to run all win condition tests using Game object
const runAllTests = () => {
    console.log("=== TESTING ALL WIN CONDITIONS WITH GAME OBJECT ===\n");
    
    // Test Row Wins
    console.log("--- Testing Row Wins ---");
    testRowWin(0); // Top row
    testRowWin(1); // Middle row
    testRowWin(2); // Bottom row
    
    // Test Column Wins
    console.log("\n--- Testing Column Wins ---");
    testColumnWin(0); // Left column
    testColumnWin(1); // Middle column
    testColumnWin(2); // Right column
    
    // Test Diagonal Wins
    console.log("\n--- Testing Diagonal Wins ---");
    testMainDiagonalWin(); // Top-left to bottom-right
    testAntiDiagonalWin(); // Top-right to bottom-left
    
    // Test Tie Game
    console.log("\n--- Testing Tie Game ---");
    testTieGame();
    
    // Test Multi-Round Game
    console.log("\n--- Testing Multi-Round Game ---");
    testMultiRoundGame();
    
    console.log("\n=== ALL TESTS COMPLETED ===");
};

// Test row win for Player 1 (X)
const testRowWin = (row) => {
    console.log(`Testing Row ${row} win for Player 1:`);
    const game = Game(3); // First to 3 wins
    
    // Player 1 (X) wins the row
    game.playerInput(row, 0);        // X
    game.playerInput((row + 1) % 3, 0); // O plays elsewhere
    game.playerInput(row, 1);        // X
    game.playerInput((row + 1) % 3, 1); // O plays elsewhere
    game.playerInput(row, 2);        // X should win
    
    // Check if round is complete
    if (game.isRoundComplete()) {
        console.log("Round completed successfully!");
        game.restartRound();
    }
};

// Test column win for Player 1 (X)
const testColumnWin = (col) => {
    console.log(`Testing Column ${col} win for Player 1:`);
    const game = Game(3); // First to 3 wins
    
    // Player 1 (X) wins the column
    game.playerInput(0, col);           // X
    game.playerInput(0, (col + 1) % 3); // O plays elsewhere
    game.playerInput(1, col);           // X
    game.playerInput(1, (col + 1) % 3); // O plays elsewhere
    game.playerInput(2, col);           // X should win
    
    // Check if round is complete
    if (game.isRoundComplete()) {
        console.log("Round completed successfully!");
        game.restartRound();
    }
};

// Test main diagonal win (top-left to bottom-right)
const testMainDiagonalWin = () => {
    console.log("Testing Main Diagonal win for Player 1:");
    const game = Game(3); // First to 3 wins
    
    // Player 1 (X) wins main diagonal
    game.playerInput(0, 0); // X
    game.playerInput(0, 1); // O plays elsewhere
    game.playerInput(1, 1); // X
    game.playerInput(0, 2); // O plays elsewhere
    game.playerInput(2, 2); // X should win
    
    // Check if round is complete
    if (game.isRoundComplete()) {
        console.log("Round completed successfully!");
        game.restartRound();
    }
};

// Test anti-diagonal win (top-right to bottom-left)
const testAntiDiagonalWin = () => {
    console.log("Testing Anti-Diagonal win for Player 1:");
    const game = Game(3); // First to 3 wins
    
    // Player 1 (X) wins anti-diagonal
    game.playerInput(0, 2); // X
    game.playerInput(0, 0); // O plays elsewhere
    game.playerInput(1, 1); // X
    game.playerInput(0, 1); // O plays elsewhere
    game.playerInput(2, 0); // X should win
    
    // Check if round is complete
    if (game.isRoundComplete()) {
        console.log("Round completed successfully!");
        game.restartRound();
    }
};

// Test tie game
const testTieGame = () => {
    console.log("Testing Tie Game:");
    const game = Game(3); // First to 3 wins
    
    // Create a tie scenario
    // Final board will be:
    // X O X1Input, player2Input
    // O X O  
    // X O X
    game.playerInput(0, 0); // X
    game.playerInput(0, 1); // O
    game.playerInput(0, 2); // X
    game.playerInput(1, 0); // O
    game.playerInput(1, 2); // X
    game.playerInput(1, 1); // O
    game.playerInput(2, 0); // X
    game.playerInput(2, 2); // O
    game.playerInput(2, 1); // X - should be tie
    
    // Check if round is complete
    if (game.isRoundComplete()) {
        console.log("Round completed successfully!");
        game.restartRound();
    }
};

// Test multi-round game to see scoring
const testMultiRoundGame = () => {
    console.log("Testing Multi-Round Game (first to 2 wins):");
    const game = Game(2); // First to 2 wins the game
    
    console.log("\n--- Round 1: Player 1 wins ---");
    // Round 1: Player 1 wins
    game.playerInput(0, 0); // X
    game.playerInput(1, 0); // O
    game.playerInput(0, 1); // X
    game.playerInput(1, 1); // O
    game.playerInput(0, 2); // X wins row 0
    
    if (game.isRoundComplete() && !game.isGameComplete()) {
        console.log("Starting next round...");
        game.restartRound();
        
        console.log("\n--- Round 2: Player 1 wins again (should win game) ---");
        // Round 2: Player 1 wins again (should win the game)
        game.playerInput(0, 0); // X
        game.playerInput(1, 0); // O
        game.playerInput(1, 1); // X
        game.playerInput(1, 2); // O
        game.playerInput(2, 2); // X wins main diagonal
        
        if (game.isGameComplete()) {
            console.log("Game completed successfully! Player 1 is the winner!");
        }
    }
};

// Run all tests
runAllTests();

