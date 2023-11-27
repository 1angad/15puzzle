const shuffleButton = document.querySelector('#shuffleButton');
shuffleButton.addEventListener('click', () => {
    newPuzzle.shuffleTiles(100);
    setTimeout(() => newPuzzle.refreshTileClasses(), 500);
});

class Puzzle15 {

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
        return this.tileSpots.every((index, i) => 
            i === this.emptyTilePosition.x + this.emptyTilePosition.y * this.columns || index === i
        );
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
    
    tiles = document.querySelectorAll(".gameTile");
    emptyTilePosition = { x: this.columns - 1, y: this.rows - 1 };
    tileSpots = [];

}

const newPuzzle = new Puzzle15();