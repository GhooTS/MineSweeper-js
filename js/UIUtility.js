const UIUtility = (function () {


    return {
        fileSelectWithNumberOptions : function (select, start, end) {

            var output = [];

            for (var i = start; i <= end; i++) {
                var option = document.createElement("option");
                option.value = i;
                option.innerText = i;
                select.appendChild(option);
            }
            return output;
        },

        tileRevealAnimator : function(oneStepTime, maxTime, drawFunc) {
        var _maxTime = maxTime;
        var _oneStepTime = oneStepTime;
        var _drawFunc = drawFunc;
        var revealer = new Utility.singleInterval();
        var tileToReveal;
        var revealAmount = 1;


        this.Start = function (tab, timeToAnimate) {
            if (revealer.IsProcessing()) {
                return false;
            }
            tileToReveal = tab;

            if (timeToAnimate != undefined) {
                SetRevealAmount(timeToAnimate);;
            } else {
                SetRevealAmount(_maxTime);
            }

            revealer.Start(oneStepTime, Animate);
        }


        function Animate() {

            var result;

            for (var i = 0; i < revealAmount; i++) {
                if (result = tileToReveal.length != 0) {
                    var current = tileToReveal.shift();
                    _drawFunc(current.x, current.y, current.value);

                    result = tileToReveal.length != 0;
                }
            }


            return result;
        }


        this.IsProcessing = function () {
            return revealer.IsProcessing();
        }

        function SetRevealAmount(timeToAnimate) {
            revealAmount = 1;

            var currentTimeToAnimate = _oneStepTime * tileToReveal.length;
            if (currentTimeToAnimate > timeToAnimate) {
                revealAmount *= (currentTimeToAnimate / timeToAnimate);
            }

            return _oneStepTime;
        }

    }
    }

}());

