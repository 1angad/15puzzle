const GameDifficulty = [20, 50, 70];

class Game {
    difficulty; // difficulty based on GameDifficulty array
    cols = 4; // how many columns
    rows = 4; // how many rows
    count; // cols * rows
    blocks; // the html elements with className="puzzle_block"
    emptyBlockCoords = [3, 3]; // Corrected starting coordinates for the empty block
    indexes = []; // keeps track of the order of the blocks

    constructor(difficultyLevel = 1) {
        this.difficulty = GameDifficulty[difficultyLevel - 1];
        this.count = this.cols * this.rows;
        this.blocks = document.getElementsByClassName("puzzle_block");
        this.emptyBlockCoords = [this.cols - 1, this.rows - 1]; // Corrected starting coordinates for the empty block
        this.indexes = [];
        this.init();
    }

    init() {
        // position each block in its proper position
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let blockIdx = x + y * this.cols;
                if (blockIdx >= this.count) break;
                let block = this.blocks[blockIdx];
                if (!block) continue; // handle undefined blocks
                this.positionBlockAtCoord(blockIdx, x, y);
                block.addEventListener('click', (e) => this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.updateBlockClasses();
        this.indexes.push(this.count - 1);
    }

    randomize(iterationCount) {
        // move a random block (x iterationCount)
        for (let i = 0; i < iterationCount; i++) {
            let randomBlockIdx = Math.floor(Math.random() * (this.count - 1));
            let moved = this.moveBlock(randomBlockIdx);
            if (!moved) i--;
        }
        // Do not call updateBlockClasses here
    }
    
    moveBlock(blockIdx) {
        // moves a block and return true if the block has moved
        let block = this.blocks[blockIdx];
        let blockCoords = this.canMoveBlock(block);
        if (blockCoords != null) {
            this.positionBlockAtCoord(blockIdx, this.emptyBlockCoords[0], this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols];
            this.emptyBlockCoords[0] = blockCoords[0];
            this.emptyBlockCoords[1] = blockCoords[1];
            this.updateBlockClasses();
            return true;
        }
        return false;
    }

    canMoveBlock(block) {
        // return the block coordinates if it can move else return null
        let blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
        let blockWidth = block.clientWidth;
        let blockCoords = [Math.floor(blockPos[0] / blockWidth), Math.floor(blockPos[1] / blockWidth)]; // Use Math.floor for integer coordinates
        let diff = [Math.abs(blockCoords[0] - this.emptyBlockCoords[0]), Math.abs(blockCoords[1] - this.emptyBlockCoords[1])];
        let canMove = (diff[0] == 1 && diff[1] == 0) || (diff[0] == 0 && diff[1] == 1);
        return canMove ? blockCoords : null;
    }
    
    positionBlockAtCoord(blockIdx, x, y) {
        // position the block at a certain coordinates
        let block = this.blocks[blockIdx];
        block.style.left = x * block.clientWidth + "px";
        block.style.top = y * block.clientWidth + "px";
    }

    onClickOnBlock(blockIdx) {
        // try move block and check if puzzle was solved
        if (this.moveBlock(blockIdx)) {
            if (this.checkPuzzleSolved()) {
                setTimeout(() => alert("Puzzle Solved!!"), 600);
            }
        }
    }

    checkPuzzleSolved() {
        // return if puzzle was solved
        for (let i = 0; i < this.indexes.length; i++) {
            if (i == this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols) continue;
            if (this.indexes[i] != i) return false;
        }
        return true;
    }

    updateBlockClasses() {
        // reset classes for all blocks
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].classList.remove('moveablepiece');
        }
    
        // get the coordinates of the blocks around the empty space
        let surroundingCoords = [
            [this.emptyBlockCoords[0] - 1, this.emptyBlockCoords[1]], // left
            [this.emptyBlockCoords[0] + 1, this.emptyBlockCoords[1]], // right
            [this.emptyBlockCoords[0], this.emptyBlockCoords[1] - 1], // top
            [this.emptyBlockCoords[0], this.emptyBlockCoords[1] + 1]  // bottom
        ];
    
        // add 'moveablepiece' class to blocks next to the empty space
        for (let coords of surroundingCoords) {
            if (coords[0] >= 0 && coords[0] < this.cols && coords[1] >= 0 && coords[1] < this.rows) {
                let blockIdx = coords[0] + coords[1] * this.cols;
                let block = this.blocks[blockIdx];
                block.classList.add('moveablepiece');
            }
        }
    }
}

const game = new Game(1); // instantiate a new Game

const shuffleButton = document.getElementById('shuffle_button');
shuffleButton.addEventListener('click', () => {
    game.randomize(5 * game.difficulty);
    setTimeout(() => game.updateBlockClasses(), 500);
});
