function boardCreator(GameConfig) {

    const maxRowsNumber = GameConfig.maxRows;
    const maxColumnsNumber = GameConfig.maxColumns;
    const minSize = GameConfig.minRowsAndColumns;

    function InitaleGameState(numberOfRows, numberOfColumns) {


        board = new Array(numberOfRows);

        for (var i = 0; i < numberOfRows; i++) {
            board[i] = [];
            for (var j = 0; j < numberOfColumns; j++) {
                board[i][j] = 0;
            }
        }

        return board;
    }

    function SetMines(board, maxMines) {

        var setMines = 0;

        while (setMines < maxMines)
        {
            var randomRow = Math.floor(Math.random() * board.length);
            var randomColumn = Math.floor(Math.random() * board[0].length);


            if (board[randomRow][randomColumn] != -1)
            {
                board[randomRow][randomColumn] = -1;
                board = increasNeightorsMinesCount(board, randomRow, randomColumn);
                setMines++;
            }
        }

        return board;
    }

    function increasNeightorsMinesCount(board,row,column)
    {
        for (var i = row - 1; i <= row + 1; i++) {
            for (var j = column - 1; j <= column + 1; j++) {

                if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {

                    if (board[i][j] != -1) {
                        board[i][j]++;
                    }
                }
            }
        }

        return board;
    }

    const Create = function (numberOfRows, numberOfColumns,minesNumber) {

        numberOfRows = MathExtend.Clamp(numberOfRows, minSize, maxRowsNumber);
        numberOfColumns = MathExtend.Clamp(numberOfColumns, minSize, maxColumnsNumber);

        this.maxMines = minesNumber;

        board = InitaleGameState(numberOfRows, numberOfColumns);
        board = SetMines(board, this.maxMines);
        return board;
    }


    return {
        Create: Create,
        maxMines: this.maxMines
    }

}



