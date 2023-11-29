document.addEventListener('DOMContentLoaded', () => {
    const newPuzzle = new Puzzle15();
    const gameMusic = document.getElementById('gameMusic');
    gameMusic.play();
    const shuffleButton = document.querySelector('#shuffleButton');
    shuffleButton.addEventListener('click', () => {
        newPuzzle.shuffleTiles(100);
        setTimeout(() => newPuzzle.refreshTileClasses(), 500);
    });
    document.getElementById('solveButton').addEventListener('click', () => {
        newPuzzle.solvePuzzle();
    });
    
});

class Puzzle15 {
    solvePuzzle() {
        this.tileSpots.forEach((_, index) => {
            const [x, y] = this.getTileCoordinates(index);
            this.setTilePosition(index, x, y);
        });
        this.emptyTilePosition = { x: this.columns - 1, y: this.rows - 1 };
        this.refreshTileClasses();
        this.showEndGameNotification();
    }
        rows = 4;
        columns = 4;
        totalTiles = 16;
        hole = { x: this.columns - 1, y: this.rows - 1 };
    
        moveTileToEmpty(tileIndex) {
            const tilePosition = this.getTilePosition(this.tiles[tileIndex]);
            if (tilePosition !== null) {
                this.setTilePosition(tileIndex, this.emptyTilePosition.x, this.emptyTilePosition.y);
                this.tileSpots[this.emptyTilePosition.x + this.emptyTilePosition.y * this.columns] = this.tileSpots[tilePosition.x + tilePosition.y * this.columns];
                this.emptyTilePosition = { x: tilePosition.x, y: tilePosition.y };
                this.hole = { x: tilePosition.x, y: tilePosition.y };
                this.refreshTileClasses();
                return true;
            }
            return false;
        }
    
        getTilePosition(tileElement) {
            const tilePos = { x: parseInt(tileElement.style.left), y: parseInt(tileElement.style.top) };
            const tileCoords = { x: Math.floor(tilePos.x / tileElement.clientWidth), y: Math.floor(tilePos.y / tileElement.clientWidth) };
            const diff = { x: Math.abs(tileCoords.x - this.emptyTilePosition.x), y: Math.abs(tileCoords.y - this.emptyTilePosition.y) };
            return (diff.x === 1 && diff.y === 0) || (diff.x === 0 && diff.y === 1) ? tileCoords : null;
        }
    
        getTileCoordinates(index) {
            return [index % this.columns, Math.floor(index / this.columns)];
        }
    
        setTilePosition(tileIndex, x, y) {
            this.tiles[tileIndex].style.left = x * this.tiles[tileIndex].clientWidth + "px";
            this.tiles[tileIndex].style.top = y * this.tiles[tileIndex].clientWidth + "px";
        }
    
        onClickTile(tileIndex) {
            if (this.moveTileToEmpty(tileIndex)) { }
            if (this.done()) {
                setTimeout(() => alert("Puzzle Complete!"), 300);
            }
        }
    
        done() {
            const isPuzzleComplete = this.tileSpots.every((index, i) => 
                i === this.emptyTilePosition.x + this.emptyTilePosition.y * this.columns || index === i
            );
            if (isPuzzleComplete) {
                clearInterval(this.timerInterval); // Stop the timer
                this.showEndGameNotification();
            }
            return isPuzzleComplete;
        }
        showEndGameNotification() {
            const endGameMessage = document.createElement("div");
            endGameMessage.textContent = "Congratulations! Puzzle Completed!";
            endGameMessage.style.position = "absolute";
            endGameMessage.style.top = "50%";
            endGameMessage.style.left = "50%";
            endGameMessage.style.transform = "translate(-50%, -50%)";
            endGameMessage.style.fontSize = "24px";
            endGameMessage.style.color = "white";
            endGameMessage.style.backgroundColor = "black";
            endGameMessage.style.padding = "20px";
            document.body.appendChild(endGameMessage);
        }
        refreshTileClasses() {
            Array.from(this.tiles).forEach((tile, index) => {
                tile.classList.remove('moveablepiece');
                const [x, y] = this.getTileCoordinates(index);
    
                if (this.isAdjacentToEmpty(x, y)) {
                    tile.classList.add('moveablepiece');
                }
            });
    
            const puzzleArray = Array.from({ length: this.rows }, () =>
                Array.from({ length: this.columns }, () => 0)
            );
    
            this.tileSpots.forEach(tileIndex => {
                const [x, y] = this.getTileCoordinates(tileIndex);
                puzzleArray[y][x] = 1;
            });
            console.log(puzzleArray);
        }
    
        constructor() {
            this.startPuzzle();
            this.startTime = null;
            this.movesCount = 0;
            this.timerInterval = null;
            this.bestTime = null;
            this.bestMoves = null;
        }
    
        isAdjacentToEmpty(x, y) {
            const adjacentPositions = [
                [this.hole.x - 1, this.hole.y],
                [this.hole.x + 1, this.hole.y],
                [this.hole.x, this.hole.y - 1],
                [this.hole.x, this.hole.y + 1]
            ];
        
            return adjacentPositions.some(([adjX, adjY]) => adjX === x && adjY === y);
        }
    
        shuffleTiles(iterationCount) {
            Array.from({ length: iterationCount }).forEach(() => {
                if (this.moveTileToEmpty(   Math.floor(Math.random() * (this.totalTiles - 1))   ) === false) {
                    iterationCount++;
                }
            });
        }
    
        startPuzzle() {
            this.startTime = new Date();
            this.movesCount = 0;
            this.startTimer();
            this.playMusic();
            Array.from({ length: this.rows }).forEach((_, y) => { // x, y grid
                Array.from({ length: this.columns }).forEach((_, x) => {
                    const tileIndex = x + y * this.columns;
                    if (!this.tiles[tileIndex]) return;
                    this.setTilePosition(tileIndex, x, y);
                    this.tiles[tileIndex].addEventListener('click', () => this.onClickTile(tileIndex));
                    this.tileSpots.push(tileIndex);
                });
            });
            this.refreshTileClasses();
        }
        startTimer() {
            this.timerInterval = setInterval(() => {
                const currentTime = new Date();
                const timeElapsed = Math.round((currentTime - this.startTime) / 1000);
                document.getElementById('timeDisplay').textContent = timeElapsed;
            }, 1000);
        }
    
        playMusic() {
            const audio = new Audio('gametune.wav');
            audio.play();
        }
        
        tiles = document.querySelectorAll(".gameTile");
        emptyTilePosition = { x: this.columns - 1, y: this.rows - 1 };
        tileSpots = [];
    
    }