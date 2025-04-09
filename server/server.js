// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Set up the express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store player data and a limit on players
let players = {};
const MAX_PLAYERS = 10;

// Serve static files (like your HTML, CSS, and JS files)
app.use(express.static('public'));

// When a new player connects
io.on('connection', (socket) => {
    // Check if we reached the max number of players
    if (Object.keys(players).length >= MAX_PLAYERS) {
        socket.emit('full', 'The game is full. Try again later.');
        socket.disconnect(); // Disconnect the player if the game is full
        return;
    }

    console.log('A player connected: ' + socket.id);

    // Initialize player data when they connect
    players[socket.id] = { x: 300, y: 200 };

    // Send current player positions to the new player
    socket.emit('init', players);

    // When a player moves, broadcast their new position
    socket.on('move', (data) => {
        players[socket.id] = data;
        io.emit('update', players); // Broadcast updated player data to all connected players
    });

    // Remove the player when they disconnect
    socket.on('disconnect', () => {
        console.log('A player disconnected: ' + socket.id);
        delete players[socket.id];
        io.emit('update', players); // Update all players with the new list
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
