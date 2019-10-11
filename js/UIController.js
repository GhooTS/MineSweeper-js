function UIController(gameConfig) {

    var table;
    var tiles = [];
    var resultBox = document.getElementById("resultBox");
    var timer = document.getElementById("gameTimer");


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
            case -4: //mark
                className = markTileClass;
                tileText = "!";
                break;
            case -2: //unmark
                className = unrevealTileClass;
                break;
            case -1:
                className = mineTileClass;
                tileText = "x";
                break;
            case 0:
                className = emptyTileClass;
                break;
            default:
                className = revealTileClass;
                tileText = value;
                break;

        }

        tiles[row][column].innerText = tileText;
        tiles[row][column].className = className;
    }

    var Animator = new UIUtility.tileRevealAnimator(gameConfig.Animator.oneStepTime, gameConfig.Animator.maxTime, UpdateTile);

    function destroyBorad() {
        table.remove();  
    }

    function SetResultBoxText(text) {
        resultBox.innerText = text;
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
                td.innerText = " ";
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

    const RemoveEventFromTiles = function (eventName,playerControls) {
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles[i].length; j++) {
                tiles[i][j].removeEventListener(eventName, playerControls);
            }
        }
    }

    const UpdateResultBox = function (result) {
        if (result) {
            SetResultBoxText("you win!");
        } else {
            SetResultBoxText("you lost!");
        }
    }

    const UpdateTimer = function (time) {
        timer.innerText = "time: " + time + "s";
    }

    const ClearResultBox = function () {
        SetResultBoxText("");
    }

    const SetTilesToReveal = function (tab, animate, timeToAnimate) {


        if (animate) {
            Animator.Start(tab, timeToAnimate);
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
        UpdateResultBox: UpdateResultBox,
        ClearResultBox: ClearResultBox,
        UpdateTimer: UpdateTimer,
        SetTilesToReveal: SetTilesToReveal,
        IsProcessing : Animator.IsProcessing
    }
}



