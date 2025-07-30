document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let gridArray = Array(16).fill(0);

    // Create the grid
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        grid.appendChild(cell);
    }

    const cells = document.querySelectorAll('.grid div');

    // Start the game with two random tiles
    startGame();

    function startGame() {
        addRandomTile();
        addRandomTile();
        updateGrid();
    }

    function addRandomTile() {
        const emptyCells = gridArray.map((val, index) => val === 0 ? index : null).filter(val => val !== null);
        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            gridArray[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateGrid() {
        for (let i = 0; i < cells.length; i++) {
            if (gridArray[i] !== 0) {
                cells[i].textContent = gridArray[i];
                cells[i].style.backgroundColor = getTileColor(gridArray[i]);
            } else {
                cells[i].textContent = '';
                cells[i].style.backgroundColor = '#eee4da';
            }
        }
        scoreDisplay.textContent = score;
    }

    function getTileColor(value) {
        const colors = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        return colors[value] || '#eee4da';
    }

    // Handle keyboard input
    // Mouse and keyboard event variables
let mouseStartX = 0;
let mouseStartY = 0;
let mouseEndX = 0;
let mouseEndY = 0;

// Keyboard and mouse event handlers
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    } else if (e.key === 'ArrowUp') {
        moveUp();
    } else if (e.key === 'ArrowDown') {
        moveDown();
    }
    addRandomTile();
    updateGrid();
});

// Mouse down event
grid.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
}, false);

// Mouse up event
grid.addEventListener('mouseup', (e) => {
    mouseEndX = e.clientX;
    mouseEndY = e.clientY;
    handleSwipe();
}, false);

// Handle swipe direction
function handleSwipe() {
    const dx = mouseEndX - mouseStartX;
    const dy = mouseEndY - mouseStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) { // Minimum swipe distance
        if (absDx > absDy) {
            // Horizontal swipe
            if (dx > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        } else {
            // Vertical swipe
            if (dy > 0) {
                moveDown();
            } else {
                moveUp();
            }
        }
        addRandomTile();
        updateGrid();
    }
}

    function moveLeft() {
        for (let i = 0; i < 16; i += 4) {
            const row = gridArray.slice(i, i + 4);
            const newRow = slide(row);
            gridArray.splice(i, 4, ...newRow);
        }
    }

    function moveRight() {
        for (let i = 0; i < 16; i += 4) {
            const row = gridArray.slice(i, i + 4);
            const newRow = slide(row.reverse()).reverse();
            gridArray.splice(i, 4, ...newRow);
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            const column = [gridArray[i], gridArray[i + 4], gridArray[i + 8], gridArray[i + 12]];
            const newColumn = slide(column);
            gridArray[i] = newColumn[0];
            gridArray[i + 4] = newColumn[1];
            gridArray[i + 8] = newColumn[2];
            gridArray[i + 12] = newColumn[3];
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            const column = [gridArray[i], gridArray[i + 4], gridArray[i + 8], gridArray[i + 12]];
            const newColumn = slide(column.reverse()).reverse();
            gridArray[i] = newColumn[0];
            gridArray[i + 4] = newColumn[1];
            gridArray[i + 8] = newColumn[2];
            gridArray[i + 12] = newColumn[3];
        }
    }

    function slide(row) {
        let filteredRow = row.filter(val => val !== 0);
        for (let i = 0; i < filteredRow.length - 1; i++) {
            if (filteredRow[i] === filteredRow[i + 1]) {
                filteredRow[i] *= 2;
                score += filteredRow[i];
                filteredRow.splice(i + 1, 1);
            }
        }
        while (filteredRow.length < 4) {
            filteredRow.push(0);
        }
        return filteredRow;
    }
});