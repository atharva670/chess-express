// 8x8 board with Unicode chess symbols
// Row 0 at top (black side), row 7 at bottom (white side)
let board = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'], // row 0
    ['♟','♟','♟','♟','♟','♟','♟','♟'], // row 1
    ['','','','','','','',''],          // row 2
    ['','','','','','','',''],          // row 3
    ['','','','','','','',''],          // row 4
    ['','','','','','','',''],          // row 5
    ['♙','♙','♙','♙','♙','♙','♙','♙'], // row 6
    ['♖','♘','♗','♕','♔','♗','♘','♖']  // row 7
  ];
  
  // Keep track of a selected piece (row,col)
  let selected = null;
  
  window.onload = function() {
    renderBoard();
  };
  
  // Create/Update the board as an HTML table
  function renderBoard() {
    const container = document.getElementById('boardContainer');
    let html = '<table id="chessTable">';
  
    for (let row = 0; row < 8; row++) {
      html += '<tr>';
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        // Light/dark square coloring
        const squareColor = ((row + col) % 2 === 0) ? 'lightSquare' : 'darkSquare';
        // Highlight if this cell is selected
        let highlight = '';
        if (selected && selected.row === row && selected.col === col) {
          highlight = ' selectedSquare';
        }
        html += `<td class="${squareColor}${highlight}" onclick="handleSquareClick(${row},${col})">`;
        if (piece) {
          html += `<span class="piece">${piece}</span>`;
        }
        html += '</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
  
    container.innerHTML = html;
  }
  
  // Called when the user clicks a square
  function handleSquareClick(row, col) {
    // If nothing selected yet, select this square if it has a piece
    if (!selected) {
      if (board[row][col] !== '') {
        selected = { row, col };
      }
      renderBoard();
      return;
    }
  
    // If we already have a selected piece
    const fromRow = selected.row;
    const fromCol = selected.col;
    const piece = board[fromRow][fromCol];
  
    // Move the piece to the new square (even if it's capturing)
    board[row][col] = piece;
    // Empty the old square
    board[fromRow][fromCol] = '';
  
    // Record this move on the server
    const moveData = {
      piece: piece,
      from: `${fromRow},${fromCol}`,
      to: `${row},${col}`
    };
    postMove(moveData);
  
    // Clear selection
    selected = null;
    renderBoard();
  }
  
  // POST a new move to the server
  function postMove(moveData) {
    fetch('/api/moves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moveData)
    })
    .then(response => response.json())
    .then(data => {
      // We could do something if needed, e.g., console.log('Move stored');
    })
    .catch(err => console.error('Error posting move:', err));
  }
  