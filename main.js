function DisplayController(board) {
  const cells = document.querySelectorAll(".cell");
  const player = document.querySelector(".player");
  const menu = document.querySelector(".menu");
  const resetBtn = document.querySelector(".reset-btn");

  resetBtn.addEventListener("click", () => {
    menu.classList.remove("blur");
    menu.classList.add("invisibility");

    game.newGame();
    refresh();
  });

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const cellId = cell.getAttribute("id");
      if (board.isCellEmpty(cellId)) {
        game.playMove(cellId);
        cell.textContent = board.get(cellId);
        player.textContent = game.getCurrentPlayerName();
      }
    });
  });
  const refresh = () => {
    cells.forEach((cell) => {
      const cellId = cell.getAttribute("id");
      cell.textContent = board.get(cellId);
    });
    player.textContent = game.getCurrentPlayerName();
  };

  const gameEndScreen = (bool) => {
    menu.hidden = false;
    menu.classList.add("blur");
    menu.classList.remove("invisibility");
  };

  return { refresh, gameEndScreen };
}

function BoardController() {
  let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const reset = () => {
    board = board.map((e) => (e = [0, 0, 0]));
  };

  /* ----------set and get-----------
     x and y should be the actuals coord of the cell,
     so that set(#cellId = 8, value) set the board 
     from
      [#7:0, #8:0, #9:0],
      [#4:0, #5:0, #6:0],
      [#1:0, #2:0, #3:0],
      to
      [#7:0, #8:value, #9:0],
      [#4:0, #5:0, #6:0],
      [#1:0, #2:0, #3:0],
     Ense the math wizardry
    */
  const XYof = (cellId) => {
    //private fonction
    const x = (cellId - 1) % 3;
    const y = 2 - Math.floor((cellId - 1) / 3);

    return { x, y };
  };

  const set = (cellId, value) => {
    const coord = XYof(cellId);
    board[coord.y][coord.x] = value;
  };

  const get = (cellId) => {
    const coord = XYof(cellId);
    if (board[coord.y][coord.x] == 0) {
      return "";
    } else {
      return board[coord.y][coord.x];
    }
  };

  const isWinningMove = (cellId) => {
    const coord = XYof(cellId);
    let isDiag =
      ((get(1) === get(5) && get(1) === get(9)) ||
        (get(7) === get(5) && get(7) === get(3))) &&
      get(5) != 0;

    const isRow =
      board[coord.y][0] === board[coord.y][1] &&
      board[coord.y][2] === board[coord.y][1];

    const isColumn =
      board[0][coord.x] === board[1][coord.x] &&
      board[2][coord.x] === board[1][coord.x];

    if (!cellId == (1 | 5 | 9)) {
    }
    return isRow || isColumn || isDiag;
  };

  const isCellEmpty = (cellId) => {
    const coord = XYof(cellId);
    return board[coord.y][coord.x] == 0;
  };

  const isFull = () => {
    let bool = true;
    for (i = 1; i <= 9; i++) {
      bool = get(i) != 0 && bool;
    }
    return bool;
  };

  return {
    set,
    get,
    isFull,
    isWinningMove,
    isCellEmpty,
    reset,
  };
}

function GameController() {
  const board = BoardController();
  const display = DisplayController(board);

  const Player = (name, marker) => {
    return { name, marker };
  };
  const player1 = Player("PLAYER 1", "x");
  const player2 = Player("PLAYER 2", "o");

  let currentPlayer;
  currentPlayer = player1;

  const getCurrentPlayerName = () => currentPlayer.name;

  const playMove = (cellId) => {
    board.set(cellId, currentPlayer.marker);
    if (board.isWinningMove(cellId)) {
      display.gameEndScreen(true);
    } else if (board.isFull()) {
      display.gameEndScreen(false);
    }

    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const newGame = () => {
    currentPlayer = player1;
    board.reset();
  };

  return { playMove, getCurrentPlayerName, newGame };
}

const game = GameController();
