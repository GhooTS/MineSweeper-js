function BoardController(_boardCreator) {

    //private fileds
    var boardCreator = _boardCreator;
    var board;
    var Rows;
    var Columns;
    var revealTilesCount;
    var numberOfTiles;
    var markMineTilesCount;
    var numberOfMines;
    var lastValue;

    

    //lost condition function
    const loseCondition = function () {
        return lastValue == -1;
    }

    //win condition functions
    const winCondition = function () {
        return IsSolve();
    }

    function IsSolve() {
        if (allTilesReveal() && allMinesMark()) {
            return true;
        }

        return false;
    }

    function allTilesReveal() {
        return revealTilesCount == numberOfTiles - numberOfMines;
    }

    function allMinesMark() {
        return markMineTilesCount == numberOfMines;
    }

   
    //new board function
    const NewBoard = function (Rows,Columns,minesNumber) {

        lastValue = 0;
        board = boardCreator.Create(Rows, Columns, minesNumber);
        this.Rows = board.length;
        this.Columns = board[0].length;
        revealTilesCount = 0;
        markMineTilesCount = 0;
        numberOfTiles = Rows * Columns;
        markMineTiles = 0;
        numberOfMines = minesNumber;
    }

    

    //reveal functions
    const revealTile = function (row, column) {

        var output = [];
        var tileValue = GetTileValue(row, column);

        lastValue = tileValue;

        if (tileValue <= -1) {
            return output;
        } 

        switch (tileValue) {
            case 0:
                output = revealChunk(row,column)
                break;
            default:
                output[0] = revealSingle(row, column);
                SetRevealFlag(row, column);
                break;
        }

        

        return output;

    }

    function revealSingle(row, column) {
        var output = new Utility.tile(row, column, board[row][column]);
        return output;
    }

    function revealChunk(row,column) {

        var visitedTiels = [];
        var tilesToViste = [];
    
        var tile = new Utility.tile(row, column, board[row][column]);
        visitedTiels.push(tile);
        tilesToViste.push(tile);

        while (tilesToViste.length > 0) {

            var currentTile = tilesToViste.shift();

            var neightbors = getNeightbores(currentTile);

            for (var i = 0; i < neightbors.length; i++) {

                var current = neightbors[i];

                if (current.value == 0) {
                    tilesToViste.push(current);
                }
                        
                visitedTiels.push(current);
                SetRevealFlag(current.x, current.y);
            }
        }

        return visitedTiels;
    }

    function getNeightbores(tile) {
        var output = [];
        var z = 0;
        var row = tile.x;
        var column = tile.y;

        for (var x = row - 1; x <= row + 1; x++) {
            for (var y = column - 1; y <= column + 1; y++) {
                if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
                    if (board[x][y] > -1) {
                        output[z] = new Utility.tile(x, y, board[x][y]);
                        z++;
                    }
                }
            }
        }


        return output;
    }

    //mark functions
    const markTile = function (row, column) {

        var tileValue = GetTileValue(row, column);

        if (tileValue < -33) {
            return tileValue;
        }

        var output = -4;

        if (tileValue < -1) {

            ClearMarkFlag(row, column);
            output = -2;


        } else {
            SetMarkFlag(row, column);

        }

        return output;
    }


    //flags functions
    const ClearFlags = function () {
        for (var i = 0; i < this.Rows; i++) {
            for (var j = 0; j < this.Columns; j++) {

                var current = board[i][j];

                if (current < -33) {
                    ClearRevealFlag(i, j);
                }
                else if (board[i][j] < -1) {
                    ClearMarkFlag(i, j);
                }
            }
        }
    }

    function SetMarkFlag(row, column) {
        var current = board[row][column] -= 32;
        if (current == -33) {
            markMineTilesCount++;
            console.log("it's a mine!");
        }
        
    }

    function ClearMarkFlag(row, column) {

        var current = board[row][column];
        if (current == -8) {
            current = 0;
        } else {
            current += 32;
        }
        if (current == -1) {
            markMineTilesCount--;
        }
        board[row][column] = current;
    }

    function ClearRevealFlag(row, column) {
        board[row][column] += 64;
    }

    function SetRevealFlag(row, column) {
        board[row][column] -= 64;
        revealTilesCount++;
    }

    


    //Gets
    const GetTileValue = function (row, column) {

        return board[row][column];
    }

    const GetUnrevealTiles = function () {
        var output = [];

        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] > -2) {
                    output.push(new Utility.tile(i, j, board[i][j]))
                }
            }
        }

        return output;
    }

    const GetAllMines = function () {
        var output = [];

        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] == -1 || board[i][j] == -33) {
                    output.push(new Utility.tile(i, j, -1));
                }
            }
        }

        return output;
    }

    const GetAllTiles = function () {
        var output = [];

        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                output.push(new Utility.tile(i, j,board[i][j]));
            }
        }

        return output;
    }

    return {
        Rows: Rows,
        Columns: Columns,
        GetTileValue: GetTileValue, 
        revealTile: revealTile,
        markTile: markTile,
        NewBoard: NewBoard,
        ClearFlags: ClearFlags,
        winCondition: winCondition,
        loseCondition: loseCondition,
        GetUnrevealTiles: GetUnrevealTiles,
        GetAllMines: GetAllMines,
        GetAllTiles: GetAllTiles
    }
}

