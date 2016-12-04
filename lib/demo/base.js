"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var index_1 = require('../src/index');
var A = (function () {
    function A() {
        this.title = '123';
    }
    return A;
}());
var B = (function () {
    function B() {
    }
    return B;
}());
var C = (function () {
    function C() {
    }
    return C;
}());
var D = (function () {
    function D(a, b) {
        this.title = 'abc';
        this.a = a;
        this.b = b;
    }
    D.prototype.test = function () {
        console.log('assert equel 123', this.a.title);
    };
    D = __decorate([
        __param(0, index_1.Inject('A')),
        __param(1, index_1.Inject('B')), 
        __metadata('design:paramtypes', [Object, Object])
    ], D);
    return D;
}());
var injector = index_1.Injector.resolveAndCreate([A, B, C, D]);
var a1 = injector.get('A');
var a2 = injector.get('A');
console.log("output: " + (a1 == a2));
