function gameController(_boardController,_playerControls,_UIController) {


    var playerControls = _playerControls;
    var boardController = _boardController;
    var UIController = _UIController;
    var timeID;
    var time;


    function countTime() {
        time++;
        UIController.UpdateTimer(time);
    }

    function EndGame(result) {
        RemovePlayerControls();
        clearInterval(timeID);
        if (result) {
            RevealAllTiles();
        }else {
            RevealBombs();
        }
        UIController.UpdateResultBox(result);
    }

    function CheckIfGameWin() {
        if (boardController.winCondition()) {
            EndGame(true);
        } else if (boardController.loseCondition()) {
            EndGame(false);
        }
    }

    function AddPlayerControls() {
        var eventName = "mousedown";
        UIController.AddEventToTiles(eventName, playerControls.SelectTile);
        UIController.AddEventToTiles(eventName, CheckIfGameWin);
    }

    function RemovePlayerControls() {
        var eventName = "mousedown";
        UIController.RemoveEventFromTiles(eventName, playerControls.SelectTile);
        UIController.RemoveEventFromTiles(eventName, CheckIfGameWin);
    }

    function RevealBombs() {

        boardController.ClearFlags();
        var tiles = boardController.GetAllMines();
        UIController.SetTilesToReveal(tiles,false);
    }

    function RevealAllTiles() {
        boardController.ClearFlags();
        var tiles = boardController.GetUnrevealTiles();
        UIController.SetTilesToReveal(tiles, false);
    }

    const StartGame = function (numberOfRows, numberOfColumns,minesNumber) {

        time = 0;
        clearInterval(timeID);
        resultBox.innerText = "";
        boardController.NewBoard(numberOfRows, numberOfColumns, minesNumber);
        UIController.CreateBoard(boardController.Rows, boardController.Columns);
        AddPlayerControls();
        UIController.UpdateTimer(time);
        timeID = setInterval(countTime, 1000);
    }

    return {
        StartGame: StartGame
    }

}

