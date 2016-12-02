"use strict";
require("reflect-metadata");
var symbol_1 = require('./symbol');
var util_1 = require('./util');
var Injector_1 = require('./Injector');
exports.Injector = Injector_1.Injector;
exports.Inject = function (token) { return function (target) {
    var existingInnerDependenceMetadataKey = util_1.getOwnMetadata(symbol_1.innerDependenceMetadataKey, target) || [];
    existingInnerDependenceMetadataKey.push(token);
    Reflect.defineMetadata(symbol_1.innerDependenceMetadataKey, existingInnerDependenceMetadataKey, target);
}; };
