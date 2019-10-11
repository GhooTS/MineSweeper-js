var Utility = (function () {

    this.rowFromID = function (id) {
        return id.substring(0, id.indexOf('_'));
    }
    this.columnFromID = function (id) {
        return id.substring(id.indexOf('_') + 1, id.length);
    }
    this.cordinationToID = function (row, column) {
        return row + "_" + column;
    }


    var tile = function (_x, _y,_value) {
        
        var value = _value;
        var x = parseInt(_x);
        var y = parseInt(_y);

        

        return {
            x: x,
            y: y,
            value: value
        }
    }

    var hashTable = function(obj) {

        var length = 0;
        var items = {};

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                items[key] = obj[key];
                length++;
            }
        }

        this.getLength = function () {
            return length;
        }

        this.hasKey = function (key) {

            if (items[key] != undefined) {
                return true;
            }

            return false;
        }


        this.getKeys = function () {
            var output = [];
            var i = 0;
            for (key in items) {
                output[i] = key;
                i++;
            }

            return output;
        }

        this.getValue = function (key) {
            var output;

            if (this.hasKey(key)) {
                output = items[key];
            } else {
                throw "invalide key";
            }

            return output;
        }

        this.getValues = function () {
            var output = [];
            var i = 0;
            for (key in items) {
                output[i] = items[key];
                i++;
            }
            return output;
        }

        this.setItem = function (key, value) {


            if (typeof (items[key]) != undefined) {
                length++;
            }

            items[key] = value;

            return this.hasKey(key);
        }

        this.removeItem = function (key) {
            if (this.hasKey(key)) {
                length--;
                delete items[key];
            } else {
                throw "invalide key"
            }

        }

        this.clear = function () {

            for (key in items) {
                this.removeItem(key);
            }

            return length == 0;
        }
    }

    var testHashTable = function() {

        this.hashTable;

        this.test = function () {
            this.hashTable = new hashTable({ 1: "32", "32": 1, 32: 2, "one": "two" });

            console.log("keys(1,32,one): " + this.hashTable.getKeys());
            console.log("values(32,2,two): " + this.hashTable.getValues());
            console.log("value for 1(32): " + this.hashTable.getValue(1));
            console.log("value for 32(2): " + this.hashTable.getValue(32));
            console.log("value for 32 braced(2): " + this.hashTable.getValue("32"));
            console.log("value for one(two): " + this.hashTable.getValue("one"));
            console.log("hasKey for one(true): " + this.hashTable.hasKey("one"));
            console.log("hasKey for two(false): " + this.hashTable.hasKey("two"));
            console.log("after clear")
            this.hashTable.clear();
            console.log("keys (should print empty):" + this.hashTable.getKeys());
            console.log("values (should print empty):" + this.hashTable.getValues());
            this.hashTable.setItem("new one", 321);
            console.log("set new item (should print new one)" + this.hashTable.getKeys())
            console.log("set new item (should print 321)" + this.hashTable.getValues())
            this.hashTable.removeItem("new one");
            console.log("keys (should print empty):" + this.hashTable.getKeys());
            console.log("values (should print empty):" + this.hashTable.getValues());
        }

    }

    var singleInterval = function() {
        var intervaleID;
        var funcToRun;
        var callback;


        function funcGuard() {
            if (funcToRun() == false) {
                if (callback != undefined) {
                    callback();
                }

                reset();
            }
        }

        function reset() {
            clearInterval(intervaleID);
            intervaleID = undefined;
            callback = undefined;
        }

        this.Start = function (timeout, func, OnEnd) {
            if (intervaleID == undefined) {
                funcToRun = func;
                callback = OnEnd;
                intervaleID = setInterval(funcGuard, timeout);
            } else {
                return false;
            }
        }

        this.Stop = function(){
            reset();
        }

        this.IsProcessing = function () {
            return intervaleID != undefined;
        }
    }

    return {
        hashTable: hashTable,
        hashTableTest: testHashTable,
        tile: tile,
        rowFromID: rowFromID,
        columnFromID: columnFromID,
        cordinationToID: cordinationToID,
        singleInterval: singleInterval
    }
}());
