class Puzzle15 {
    constructor() {
        this.columns = 4;
        this.rows = 4;
        this.totalTiles = this.columns * this.rows;
        this.tiles = document.getElementsByClassName("gameTile");
        this.emptyTilePosition = { x: this.columns - 1, y: this.rows - 1 };
        this.tileIndexes = [];
        this.initialize();
    }

    initialize() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const tileIndex = x + y * this.columns;
                if (tileIndex >= this.totalTiles) break;
                const tileElement = this.tiles[tileIndex];
                if (!tileElement) continue;
                this.positionTile(tileIndex, x, y);
                tileElement.addEventListener('click', () => this.onClickTile(tileIndex));
                this.tileIndexes.push(tileIndex);
            }
        }
        this.tileIndexes.push(this.totalTiles - 1);
        this.updateTileClasses();
    }

    shuffle(iterationCount) {
        for (let i = 0; i < iterationCount; i++) {
            const randomTileIndex = Math.floor(Math.random() * (this.totalTiles - 1));
            const moved = this.moveTile(randomTileIndex);
            if (!moved) i--;
        }
    }

    moveTile(tileIndex) {
        const tileElement = this.tiles[tileIndex];
        const tilePosition = this.getTilePosition(tileElement);
        if (tilePosition !== null) {
            this.positionTile(tileIndex, this.emptyTilePosition.x, this.emptyTilePosition.y);
            this.tileIndexes[this.emptyTilePosition.x + this.emptyTilePosition.y * this.columns] = this.tileIndexes[tilePosition.x + tilePosition.y * this.columns];
            this.emptyTilePosition = { x: tilePosition.x, y: tilePosition.y };
            this.updateTileClasses();
            return true;
        }
        return false;
    }

    getTilePosition(tileElement) {
        const tilePos = { x: parseInt(tileElement.style.left), y: parseInt(tileElement.style.top) };
        const tileWidth = tileElement.clientWidth;
        const tileCoords = { x: Math.floor(tilePos.x / tileWidth), y: Math.floor(tilePos.y / tileWidth) };
        const diff = { x: Math.abs(tileCoords.x - this.emptyTilePosition.x), y: Math.abs(tileCoords.y - this.emptyTilePosition.y) };
        return (diff.x === 1 && diff.y === 0) || (diff.x === 0 && diff.y === 1) ? tileCoords : null;
    }

    positionTile(tileIndex, x, y) {
        const tileElement = this.tiles[tileIndex];
        tileElement.style.left = x * tileElement.clientWidth + "px";
        tileElement.style.top = y * tileElement.clientWidth + "px";
    }

    onClickTile(tileIndex) {
        if (this.moveTile(tileIndex)) {
            if (this.isPuzzleSolved()) {
                setTimeout(() => alert("Done."), 300);
            }
        }
    }

    isPuzzleSolved() {
        for (let i = 0; i < this.tileIndexes.length; i++) {
            if (i === this.emptyTilePosition.x + this.emptyTilePosition.y * this.columns) {
                continue;
            }
            if (this.tileIndexes[i] !== i) {
                return false;
            }
        }
        return true;
    }

    updateTileClasses() {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].classList.remove('moveablepiece');
        }

        const adjacentPositions = [
            [this.emptyTilePosition.x - 1, this.emptyTilePosition.y],
            [this.emptyTilePosition.x + 1, this.emptyTilePosition.y],
            [this.emptyTilePosition.x, this.emptyTilePosition.y - 1],
            [this.emptyTilePosition.x, this.emptyTilePosition.y + 1]
        ];

        for (const coords of adjacentPositions) {
            const [x, y] = coords;
            if (x >= 0 && x < this.columns && y >= 0 && y < this.rows) {
                const tileIndex = x + y * this.columns;
                const tileElement = this.tiles[tileIndex];
                tileElement.classList.add('moveablepiece');
            }
        }
    }
}

const fifteenPuzzle = new Puzzle15();

const shuffleButton = document.getElementById('shuffleButton');
shuffleButton.addEventListener('click', () => {
    fifteenPuzzle.shuffle(5);
    setTimeout(() => fifteenPuzzle.updateTileClasses(), 500);
});
