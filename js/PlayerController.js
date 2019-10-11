function playerControls(_boardController,_uiController) {

    var boardController = _boardController;
    var uiController = _uiController;

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

   

    function RevealTile(row,column) {

        if (uiController.IsProcessing()) {
            return; 
        }

        tiles = boardController.revealTile(row, column);

        if (tiles.length == 0) {
            return;
        }

        uiController.SetTilesToReveal(tiles,false);
    }

    function MarkTile(row, column) {
        value = boardController.markTile(row, column);
        if (value == null) {
            return;
        }
        uiController.UpdateTile(row, column, value);
    }

    return {
        SelectTile: SelectTile,
    }
}
