// game.js

const socket = io();

// Setting up the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player object
let player = { x: 300, y: 200, width: 50, height: 50, color: "blue" };

// Listen for the "full" event if the game is full
socket.on('full', (message) => {
    alert(message);  // Show an alert if the game is full
    window.location.reload();  // Optionally reload the page to try again later
});

// Listen for initial player data from the server
socket.on('init', (players) => {
    // If it's a two-player game, we can set the second player data
    // For now, assuming we just need to handle the first player's movement
    if (Object.keys(players).length > 1) {
        player.color = 'red'; // Change color if it's Player 2
    }
});

// Listen for updates to other players
socket.on('update', (players) => {
    // Assume we get a list of players and update their positions
    for (let id in players) {
        let p = players[id];
        // Here we would draw both players
        ctx.fillStyle = id === socket.id ? "blue" : "red"; // Blue for the local player
        ctx.fillRect(p.x, p.y, 50, 50);
    }
});

// Handle local player movement
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") player.y -= 5;
    if (event.key === "ArrowDown") player.y += 5;
    if (event.key === "ArrowLeft") player.x -= 5;
    if (event.key === "ArrowRight") player.x += 5;

    // Emit the new position to the server
    socket.emit('move', player);
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
