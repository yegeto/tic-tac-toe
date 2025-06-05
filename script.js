function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((column) => column.getValue())
    );
    console.log(boardWithCellValues);
  };

  const markCell = (row, column, player) => {
    if (board[row][column].getValue() === "") {
      board[row][column].setMarker(player);
      return true;
    }
    return false;
  };

  return { getBoard, printBoard, markCell };
}

function cell() {
  let value = "";

  const getValue = () => value;

  const setMarker = (playerMarker) => {
    value = playerMarker;
  };

  return { getValue, setMarker };
}

function gameController(player1Name = "player1", player2Name = "player2") {
  const board = gameBoard();
  const players = [
    { name: player1Name, marker: "X" },
    { name: player2Name, marker: "Y" },
  ];
  let activePlayer = players[0];
  let gameStatus = "continues";
  let gameTurn = 0;

  const getActivePlayer = () => activePlayer;
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const winnerCombinations = [
    [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
    ],
    [
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 1, column: 2 },
    ],
    [
      { row: 2, column: 0 },
      { row: 2, column: 1 },
      { row: 2, column: 2 },
    ],
    [
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 },
    ],
    [
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      { row: 2, column: 1 },
    ],
    [
      { row: 0, column: 2 },
      { row: 1, column: 2 },
      { row: 2, column: 2 },
    ],
    [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 2 },
    ],
    [
      { row: 0, column: 2 },
      { row: 1, column: 1 },
      { row: 2, column: 0 },
    ],
  ];

  const findWinner = () => {
    let winner = "";
    const boardValues = board.getBoard();

    for (const combination of winnerCombinations) {
      const firstSquareSymbol =
        boardValues[combination[0].row][combination[0].column].getValue();
      const secondSquareSymbol =
        boardValues[combination[1].row][combination[1].column].getValue();
      const thirdSquareSymbol =
        boardValues[combination[2].row][combination[2].column].getValue();

      if (
        firstSquareSymbol &&
        firstSquareSymbol === secondSquareSymbol &&
        firstSquareSymbol === thirdSquareSymbol
      ) {
        winner =
          players[0].marker === firstSquareSymbol ? players[0] : players[1];
      }
    }

    return winner;
  };

  const playRound = (row, column) => {
    if (gameStatus === "over") {
      return;
    }

    console.log(
      `Marking ${
        getActivePlayer().name
      }'s token into row:${row} column:${column}...`
    );

    const isSquareMarked = board.markCell(
      row,
      column,
      getActivePlayer().marker
    );

    const winner = findWinner();
    if (winner) {
      gameStatus = "over";
      board.printBoard();
      console.log(`${winner.name} wins the game.`);
      return;
    }

    switchPlayerTurn();
    printNewRound();
    gameTurn++;
    if (gameTurn === 8 && !winner) {
      gameStatus = "over";
      board.printBoard();
      console.log("It’s a draw!");
      return;
    }
  };

  printNewRound();

  return { getActivePlayer, playRound };
}

const game = gameController();
