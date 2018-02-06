"use strict";

exports.gettype = function (obj) {
    return (/^\[object (.+)\]$/i.exec(Object.prototype.toString.call(obj))[1].toLowerCase()
    );
};