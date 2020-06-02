var MineSweeper = (function () {

    const maxRowsNumber = 99;
    const maxColumnsNumber = 99;
    const minSize = 5;

    var GameData = (function ()
    {
        var markTiles = 0;
        var minesLeft = 0;

        function Reset() {
            this.markTiles = 0;
        }

        return {
            markTiles: markTiles,
            minesLeft: minesLeft,
            Reset: Reset
        }
    }());

    var UI = (function () {
        var markTilesCounter = document.getElementById("markTiles");
        var minesLeftCounter = document.getElementById("minesLeft");


        function Update(){
            markTilesCounter.innerText = GameData.markTiles;
            var minesLeft = GameData.minesLeft - GameData.markTiles;
            minesLeftCounter.innerText = minesLeft;
            if (minesLeft < 0) {
                minesLeftCounter.style.color = "rgb(224, 29, 29)";
            } else {
                minesLeftCounter.style.color = "white";
            }
        }

        return {
            Update: Update
        }
    }())

    var BoardCreator = (function () {

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

            while (setMines < maxMines) {
                var randomRow = Math.floor(Math.random() * board.length);
                var randomColumn = Math.floor(Math.random() * board[0].length);


                if (board[randomRow][randomColumn] != -1) {
                    board[randomRow][randomColumn] = -1;
                    board = increasNeightorsMinesCount(board, randomRow, randomColumn);
                    setMines++;
                }
            }

            return board;
        }

        function increasNeightorsMinesCount(board, row, column) {
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

        const Create = function (numberOfRows, numberOfColumns, minesNumber) {

            this.maxMines = minesNumber;

            board = InitaleGameState(numberOfRows, numberOfColumns);
            board = SetMines(board, this.maxMines);
            return board;
        }


        return {
            Create: Create,
            maxMines: this.maxMines
        }
    }());

    var BoardController = (function () {

        //private fileds
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
        const NewBoard = function (Rows, Columns, minesNumber) {

            lastValue = 0;
            board = BoardCreator.Create(Rows, Columns, minesNumber);
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
                    output = revealChunk(row, column)
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

        function revealChunk(row, column) {

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

                    if (board[i][j] == -33) {
                        continue;
                    }else if (board[i][j] < -1) {
                        ClearMarkFlag(i, j);
                    }
                }
            }
        }

        function SetMarkFlag(row, column) {
            var current = board[row][column] -= 32;
            if (current == -33) {
                markMineTilesCount++;
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
                        output.push(new Utility.tile(i, j, board[i][j]));
                    }
                }
            }

            return output;
        }

        const GetAllTiles = function () {
            var output = [];

            for (var i = 0; i < board.length; i++) {
                for (var j = 0; j < board[i].length; j++) {
                    output.push(new Utility.tile(i, j, board[i][j]));
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
    }());

    var Animator = (function () {
        var maxTime = 300;
        var oneStepTime = 5;
        var drawFunc;
        var revealer = new Utility.singleInterval();
        var tileToReveal;
        var revealAmount = 1;


        var Start = function (tab, timeToAnimate, drawFunction) {
            if (revealer.IsProcessing()) {
                return false;
            }
            tileToReveal = tab;
            drawFunc = drawFunction;

            if (timeToAnimate != undefined) {
                SetRevealAmount(timeToAnimate);;
            } else {
                SetRevealAmount(maxTime);
            }

            revealer.Start(oneStepTime, Animate);
        }

        function Animate() {

            var result;

            for (var i = 0; i < revealAmount; i++) {
                if (result = tileToReveal.length != 0) {
                    var current = tileToReveal.shift();
                    drawFunc(current.x, current.y, current.value);

                    result = tileToReveal.length != 0;
                }
            }


            return result;
        }

        var IsProcessing = function () {
            return revealer.IsProcessing();
        }

        function SetRevealAmount(timeToAnimate) {
            revealAmount = 1;

            var currentTimeToAnimate = oneStepTime * tileToReveal.length;
            if (currentTimeToAnimate > timeToAnimate) {
                revealAmount *= (currentTimeToAnimate / timeToAnimate);
            }

            return oneStepTime;
        }

        return {
            Start: Start,
            IsProcessing: IsProcessing
        }
    }());

    var BoardUIController = (function () {
        var table;
        var tiles = [];


        const markTileClass = "tile-mark";
        const revealTileClass = "tile-reveal";
        const unrevealTileClass = "tile-cover";
        const mineTileClass = "tile-mine";
        const emptyTileClass = "tile-empty";

        const UpdateTile = function (row, column, value) {

            var tileText = "";
            var className;

            if (value < -33) {
                return;
            }

            switch (value) {
                case -33:
                    className = "tile-dead-mine"
                    tileText = "*"
                    break;
                case -4: //mark
                    className = markTileClass;
                    tileText = "!";
                    break;
                case -2: //unmark
                    className = unrevealTileClass;
                    tileText = "0"
                    break;
                case -1:
                    className = mineTileClass;
                    tileText = "x";
                    break;
                case 0:
                    className = emptyTileClass;
                    tileText = "0";
                    break;
                default:
                    className = revealTileClass;
                    tileText = value;
                    break;

            }

            tiles[row][column].innerText = tileText;
            tiles[row][column].className = className;
        }

        function destroyBorad() {
            table.remove();
        }

        const CreateBoard = function (numberOfRows, numberOfColunms) {

            if (table != undefined) {
                destroyBorad();
            }

            tiles = new Array(numberOfRows);

            table = document.createElement("table");
            table.id = "GameBoard";
            table.className = "noselect";

            for (var i = 0; i < numberOfRows; i++) {
                var tr = table.appendChild(document.createElement("tr"));

                tiles[i] = [];
                for (var j = 0; j < numberOfColunms; j++) {
                    var td = tr.appendChild(document.createElement("td"));
                    td.className = unrevealTileClass;
                    td.innerText = "0";
                    tiles[i][j] = td;
                    td.id = i + "_" + j;
                }
            }
            document.getElementById("gameContainer").appendChild(table);

        }

        const AddEventToTiles = function (eventName, playerControls) {

            for (var i = 0; i < tiles.length; i++) {
                for (var j = 0; j < tiles[i].length; j++) {
                    tiles[i][j].addEventListener(eventName, playerControls);
                }
            }
        }

        const RemoveEventFromTiles = function (eventName, playerControls) {
            for (var i = 0; i < tiles.length; i++) {
                for (var j = 0; j < tiles[i].length; j++) {
                    tiles[i][j].removeEventListener(eventName, playerControls);
                }
            }
        }

        const SetTilesToReveal = function (tab, animate, timeToAnimate) {


            if (animate) {
                Animator.Start(tab, timeToAnimate, UpdateTile);
            } else {
                revealTiles(tab);
            }

            return true;
        }

        function revealTiles(tiles) {

            for (var i = 0; i < tiles.length; i++) {
                var current = tiles[i];
                UpdateTile(current.x, current.y, current.value);
            }
        }

        return {
            CreateBoard: CreateBoard,
            UpdateTile: UpdateTile,
            AddEventToTiles: AddEventToTiles,
            RemoveEventFromTiles: RemoveEventFromTiles,
            SetTilesToReveal: SetTilesToReveal
        }
    }());

    var TimerCounter = (function () {
        var time = -1;
        var timerBox = document.getElementById("gameTimer");
        var timerId;
        var active = false;

        function countTime() {
            timerBox.innerText = time + "s";
            time++;
        }

        var start = function () {
            stop();
            this.active = true;
            time = 0;
            countTime();
            timerId = setInterval(countTime, 1000);
        }

        var stop = function () {
            if (timerId != undefined) {
                clearInterval(timerId);
                timerId = undefined;
            }
            this.active = false;
        }

        return {
            start: start,
            stop: stop,
            active: active
        }

    }());

    var PlayerControls = (function () {

        const SelectTile = function () {

            var id = event.target.id;

            var row = Utility.rowFromID(id);
            var column = Utility.columnFromID(id);

            switch (event.button) {
                case 0:
                    RevealTile(row, column);
                    break;
                case 2:
                    MarkTile(row, column);
                    break;
            }
        }

        function RevealTile(row, column) {

            if (TimerCounter.active == false) {
                TimerCounter.start();
            }

            if (Animator.IsProcessing()) {
                return;
            }

            tiles = BoardController.revealTile(row, column);

            if (tiles.length == 0) {
                return;
            }

            BoardUIController.SetTilesToReveal(tiles, true);
            UI.Update();
        }

        function MarkTile(row, column) {
            if (TimerCounter.active == false) {
                TimerCounter.start();
            }

            value = BoardController.markTile(row, column);
            if (value == null) {
                return;
            }
            GameData.markTiles += value == -4 ? 1 : -1;
            BoardUIController.UpdateTile(row, column, value);
            UI.Update();
        }

        return {
            SelectTile: SelectTile,
        }
    }());

    var GameController = (function () {

        function EndGame(result) {
            RemovePlayerControls();
            TimerCounter.stop();
            if (result) {
                RevealAllTiles();
                RevealBombs();
                ResultBox.update("Result: Noice :)","#89ff87");
            } else {
                RevealBombs();
                ResultBox.update("Result: Better luck next time :(","#ff8787");
            }
        }

        
        function AddPlayerControls() {
            var eventName = "mousedown";
            BoardUIController.AddEventToTiles(eventName, PlayerControls.SelectTile);
            BoardUIController.AddEventToTiles(eventName, CheckIfGameWin);
        }

        function RemovePlayerControls() {
            var eventName = "mousedown";
            BoardUIController.RemoveEventFromTiles(eventName, PlayerControls.SelectTile);
            BoardUIController.RemoveEventFromTiles(eventName, CheckIfGameWin);
        }

        function RevealBombs() {

            BoardController.ClearFlags();
            var tiles = BoardController.GetAllMines();
            BoardUIController.SetTilesToReveal(tiles, false);
        }

        function RevealAllTiles() {
            BoardController.ClearFlags();
            var tiles = BoardController.GetUnrevealTiles();
            BoardUIController.SetTilesToReveal(tiles, false);
        }

        const StartGame = function (numberOfRows, numberOfColumns, minesNumber) {

            ResultBox.update(" ");
            BoardController.NewBoard(numberOfRows, numberOfColumns, minesNumber);
            BoardUIController.CreateBoard(BoardController.Rows, BoardController.Columns);
            AddPlayerControls();
        }

        function CheckIfGameWin() {
            if (BoardController.winCondition()) {
                EndGame(true);
            } else if (BoardController.loseCondition()) {
                EndGame(false);
            }
        }


        return {
            StartGame: StartGame
        }
    }());

    var Options = (function () {
        var rowField = document.getElementById("numberOfRows");
        var columnField = document.getElementById("numberOfColumns");
        var mineField = document.getElementById("numberOfMines");
        var startGameButton = document.getElementById("startGameButton");


        function startGame() {
            var rows = parseInt(rowField.value);
            var columns = parseInt(columnField.value);
            var mines = parseInt(mineField.value);

            rows = setValue(rows, minSize, minSize, maxRowsNumber);
            columns = setValue(columns, minSize, minSize, maxColumnsNumber);
            mines = setValue(mines, 1, 1, (rows * columns - 1));

            rowField.value = rows;
            columnField.value = columns;
            mineField.value = mines;

            GameData.Reset();
            GameController.StartGame(rows, columns, mines);
            GameData.minesLeft = mines;
            UI.Update();

            function setValue(value, defaultValue, min, max) {
                var output;

                if (isNaN(value) || value == undefined) {
                    output = defaultValue;
                }
                else {
                    output = Utility.clamp(value, min, max);
                }

                return output;
            }
        }

        startGameButton.addEventListener("click", startGame);

    }());

    var ResultBox = (function () {

        var resultBox = document.getElementById("resultBox");


        var update = function (content,color) {
            resultBox.innerText = content;
            resultBox.style.color = color;
        }

        return {
            update:update
        }
    }());

}());