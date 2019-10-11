var MathExtend = (function () {

    var Clamp = function (value, min, max) {
        return Math.min(max, Math.max(value, min));
    }


    return {
        Clamp: Clamp
    }
}());

