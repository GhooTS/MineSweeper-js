async function getGameConfig(callBack) {
    const response = await fetch("./GameConfig.json");
    const gameConfig = await response.json();

    callBack(gameConfig);
}

var GameInit = (function () {
    var GameLibary = [
        "GameSetting",
        "Utility",
        "UIUtility",
        "MathExtend",
        "BoardCreator",
        "UIController",
        "PlayerController",
        "BoardController",
        "GameController",
        "MinesSweeperGame"
    ];

    function loadGameFile(path, elementID) {

        var addToElement;

        if (elementID != "") {
             addToElement = document.getElementById(elementID);
        } else {
            addToElement = document.getElementsByTagName("body")[0];
        }

        for (var i = 0; i < GameLibary.length; i++) {
            var script = addToElement.appendChild(document.createElement("script"));
            script.setAttribute("src", path + GameLibary[i] + ".js");
            script.setAttribute("type", "text/javascript");
        }
        
    }

    function removeSelf() {
        document.getElementById("gameInit").remove();
    }

    function setUISetting(gameContener,gameConfig) {
        var maxRows = gameConfig.maxRows;
        var maxColumns = gameConfig.maxColumns;
        var minRowsAndColumns = gameConfig.minRowsAndColumns;


        var RowsSelect = setMinMaxInput("numberOfRows", minRowsAndColumns, maxRows)
        var ColumnsSelect = setMinMaxInput("numberOfColumns", minRowsAndColumns, maxColumns);
        var MinesNumber = setMinMaxInput("numberOfMines", minRowsAndColumns, maxColumns);

        createAndLinkStartButton(gameContener, RowsSelect, ColumnsSelect, MinesNumber);
    }

    function getAndFillSelector(id,min,max) {
        var output = document.getElementById(id);
        UIUtility.fileSelectWithNumberOptions(output, min, max);
        return output;
    }

    function setMinMaxInput(id, min, max) {
        var output = document.getElementById(id);
        output.value = min;

        return output;
    }

    function createAndLinkStartButton(gameContener, RowSelect, ColumnSelect, MinesNumber) {
        return document.getElementById("NewGameButton").addEventListener("click", (function () {
            var Rows = RowSelect.value;
            var Columns = ColumnSelect.value;
            var minesNumber = MinesNumber.value;

            

            Rows = parseInt(Rows);
            Columns = parseInt(Columns);
            minesNumber = parseInt(minesNumber);

            Rows = Math.min(Rows, 99);
            Columns = Math.min(Columns, 99);
            minesNumber = Math.min(Rows * Columns - 1, minesNumber);


            RowSelect.value = Rows;
            ColumnSelect.value = Columns;
            MinesNumber.value = minesNumber;

            gameContener.NewGame(Rows, Columns, minesNumber);
        }));
    }

    function Init(gameConfig) {
        setUISetting(new MinesSweeperGame(gameConfig), gameConfig);
        removeSelf();
    }


    return {
        Start:  function () {
            loadGameFile("./js/", "");
            getGameConfig(Init);
        }
    }
}());

GameInit.Start();








