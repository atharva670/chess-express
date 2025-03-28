const express = require('express');
const path = require('path');

const app = express();

// For parsing JSON in POST requests
app.use(express.json());

// Serve everything in this folder as static (index.html, moves.html, etc.)
app.use(express.static(__dirname));

// Our in-memory moves array
let moves = [];

// Return all moves as JSON
app.get('/api/moves', (req, res) => {
  res.json(moves);
});

// Store a new move
app.post('/api/moves', (req, res) => {
  // Expecting something like { piece: '♙', from: '6,4', to: '4,4' }
  moves.push(req.body);
  res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
