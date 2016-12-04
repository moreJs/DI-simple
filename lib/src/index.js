"use strict";
require("reflect-metadata");
var symbol_1 = require('./symbol');
var util_1 = require('./util');
var Injector_1 = require('./Injector');
exports.Injector = Injector_1.Injector;
exports.Inject = function (token) { return function (target) {
    var existingInnerDependenceMetadataKey = util_1.getOwnMetadata(symbol_1.innerDependenceMetadataKey, target) || [];
    // 这个顺序很奇怪相反的
    existingInnerDependenceMetadataKey.unshift(token);
    Reflect.defineMetadata(symbol_1.innerDependenceMetadataKey, existingInnerDependenceMetadataKey, target);
}; };
