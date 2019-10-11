function MinesSweeperGame(gameConfig) {

    var boardcreator = new boardCreator(gameConfig);
    var boardcontroller = new BoardController(boardcreator);
    var uicontroller = new UIController(gameConfig);
    var playercontrols = new playerControls(boardcontroller, uicontroller);
    var gamecontroller = new gameController(boardcontroller, playercontrols, uicontroller);



    const NewGame = function (numberOfRows, numberOfColumn, minesNumber) {
        gamecontroller.StartGame(numberOfRows, numberOfColumn, minesNumber);
    }

    return {
        NewGame: NewGame
    }
}





