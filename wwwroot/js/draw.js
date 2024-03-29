"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/drawDotHub").build();
var randomR = Math.floor(Math.random() * 255);
var randomG = Math.floor(Math.random() * 255);
var randomB = Math.floor(Math.random() * 255);


// Reroll colors if result color is white
while (randomR == 255 && randomG == 255 && randomB == 255) {
    randomR = Math.floor(Math.random() * 255);
    randomG = Math.floor(Math.random() * 255);
    randomB = Math.floor(Math.random() * 255);
}

connection.on("updateDot", function (x, y, r, g, b) {
    drawDot(x, y, 8, r, g, b);
});

connection.on("clearCanvas", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

connection.start().then(function () {
    // nothing here
}).catch(function (err) {
    return console.error(err.toString());
});

function tellServerToClear() {
    connection.invoke("ClearCanvas").catch(function (err) {
        return console.error(err.toString());
    });
}
//////////////////////////////////////////////////////
// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;
// Variables to keep track of the mouse position and left-button status
var mouseX, mouseY, mouseDown = 0;
// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(x, y, size, r, g, b) {
    var a = 255;
    // Select a fill style
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown = 1;
    drawDot(mouseX, mouseY, 8, randomR, randomG, randomB);

    connection.invoke("UpdateCanvas", mouseX, mouseY, randomR, randomG, randomB).catch(function (err) {
        return console.error(err.toString());
    });
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);
    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown == 1) {
        drawDot(mouseX, mouseY, 8, randomR, randomG, randomB);
        connection.invoke("UpdateCanvas", mouseX, mouseY, randomR, randomG, randomB).catch(function (err) {
            return console.error(err.toString());
        });
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

// Set-up the canvas and add our event handlers after the page has loaded
// Get the specific canvas element from the HTML document
canvas = document.getElementById('sketchpad');
// If the browser supports the canvas tag, get the 2d drawing context for this canvas
if (canvas.getContext)
    ctx = canvas.getContext('2d');

// Check that we have a valid context to draw on/with before adding event handlers
if (ctx) {
    // React to mouse events on the canvas, and mouseup on the entire document
    canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
    canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
    window.addEventListener('mouseup', sketchpad_mouseUp, false);
}
else {
    document.write("Browser not supported!!");
}
