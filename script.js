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
      row.map((cell) => cell.getValue())
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

function gameController(player1Name, player2Name) {
  const board = gameBoard();
  const players = [
    { name: player1Name, marker: "X" },
    { name: player2Name, marker: "O" },
  ];
  let activePlayer = players[0];
  let gameStatus = "continues";
  let gameTurn = 0;

  const getGameStatus = () => gameStatus;
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
    let winner = null;
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
    if (gameStatus !== "continues") {
      return;
    }

    const targetCellValue = board.getBoard()[row][column].getValue();
    if (targetCellValue !== "") {
      console.log("Cell is already occupied");
      return;
    }

    console.log(
      `Marking ${
        getActivePlayer().name
      }'s token into row:${row} column:${column}...`
    );

    board.markCell(row, column, getActivePlayer().marker);

    const winner = findWinner();
    if (winner) {
      gameStatus = "over";
      board.printBoard();
      console.log(`${winner.name} wins the game.`);
      return;
    }

    if (gameTurn === 8 && !winner) {
      gameStatus = "draw";
      board.printBoard();
      console.log("It’s a draw!");
      return;
    }

    switchPlayerTurn();
    printNewRound();
    gameTurn++;
  };

  printNewRound();

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    getGameStatus,
  };
}

function screenController(player1Name, player2Name) {
  const game = gameController(player1Name, player2Name);
  const boardDiv = document.querySelector(".board");
  const infoScreen = document.querySelector(".info-screen");
  const resetBtn = document.querySelector(".reset-button");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    if (game.getGameStatus() === "continues") {
      infoScreen.textContent = `${activePlayer.name}'s turn...`;
    } else if (game.getGameStatus() === "draw") {
      infoScreen.textContent = "It’s a draw!";
      resetBtn.classList.remove("hidden");
    } else {
      infoScreen.textContent = `${activePlayer.name} wins the game.`;
      resetBtn.classList.remove("hidden");
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.row = rowIndex;
        cellElement.dataset.column = columnIndex;
        cellElement.textContent = `${cell.getValue()}`;
        boardDiv.appendChild(cellElement);
      });
    });
  };

  boardDiv.addEventListener("click", (e) => {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow && !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  });

  updateScreen();
}

function getUserInput() {
  const nameForm = document.querySelector(".player-name-form");
  const clearBtn = document.querySelector(".clear-btn");
  const resetBtn = document.querySelector(".reset-button");

  nameForm.addEventListener("submit", (e) => {
    e.preventDefault;
    const formData = new FormData(nameForm);
    const player1Name = formData.get("player-one-name")
      ? formData.get("player-one-name")
      : "Player 1";
    const player2Name = formData.get("player-two-name")
      ? formData.get("player-two-name")
      : "Player 2";
    resetBtn.classList.add("hidden");
    screenController(player1Name, player2Name);
  });

  clearBtn.addEventListener("click", () => {
    nameForm.reset();
  });
}

getUserInput();
