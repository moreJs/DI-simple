"use strict";
var is = require('is');
var symbol_1 = require('./symbol');
var util_1 = require('./util');
/** 注射器 */
var Injector = (function () {
    function Injector(providers) {
        // 标准化 providers
        this.providers = this.normalize(providers);
        /** cache token => value */
        this.map = new Map();
    }
    /**
        {
            token: '',
            provider: {
                useClass | useValue | useFactory: {}
            },
            deps: []
        }
     */
    Injector.prototype.normalize = function (providers) {
        return providers.map(function (provider) {
            provider = provider || {};
            if (!provider.provider) {
                provider = {
                    token: provider.name,
                    useClass: provider,
                    deps: util_1.getOwnMetadata(symbol_1.innerDependenceMetadataKey, provider)
                };
            }
            return provider;
        });
    };
    /**最重要的方法：
        1: 检查是否是循环引用
     */
    Injector.prototype.judgeIsCycleDeps = function (provider) {
        var self = this;
        // 依赖表 
        var depsMap = new Map();
        // 默认为false
        var isCycleDeps = false;
        // deps 是以 token 的形式
        var _judgeIsCycleDepsByDeps = function (deps) {
            // 若已经循环依赖，直接返回
            if (isCycleDeps) {
                return;
            }
            deps.forEach(function (depToken) {
                // 先找到 item, 依据 token
                var item = self.getTargetProvider(depToken);
                _judgeIsCycleDepsBySelf(item);
            });
        };
        // 接受的是 item
        var _judgeIsCycleDepsBySelf = function (item) {
            var token = item.token, deps = item.deps;
            var has = depsMap.has(token);
            // 说明已经循环引用了
            if (has || isCycleDeps) {
                isCycleDeps = true;
                return;
            }
            // 没有依赖的，不用记录到依赖表中
            if (!deps || deps.length == 0) {
                return;
            }
            // 有依赖的，并且依赖表中没有的，记录在表中
            depsMap.set(token, deps);
            _judgeIsCycleDepsByDeps(deps);
        };
        _judgeIsCycleDepsBySelf(provider);
        return isCycleDeps;
    };
    Injector.prototype.getTargetProvider = function (token) {
        var ret = this.providers.filter(function (item) { return item.token === token; });
        return ret && ret[0];
    };
    Injector.prototype.createSingleton = function (token) {
        var self = this;
        var target = this.getTargetProvider(token);
        var isCycleDeps = this.judgeIsCycleDeps(target);
        if (isCycleDeps) {
            throw token + " \u5B58\u5728\u5FAA\u73AF\u996E\u7528";
        }
        var _makeValue = function (item, deps) {
            var token = item.token, useClass = item.useClass, useValue = item.useValue, useFactory = item.useFactory;
            if (useClass) {
                return new (useClass.bind.apply(useClass, [void 0].concat(deps)))();
            }
            else if (useValue) {
                return useValue;
            }
            else if (useFactory) {
                // to do paramteres
                return useFactory(deps);
            }
            else {
                throw token + " provider \u662F\u975E\u6CD5\u7684";
            }
        };
        // 接受的是item, 创建对象
        var _createSingleton = function (item) {
            var token = item.token, useClass = item.useClass, useValue = item.useValue, useFactory = item.useFactory, deps = item.deps;
            if (!deps || deps.length == 0) {
                return _makeValue(item);
            }
            var _arguments = [];
            deps.forEach(function (dep) {
                var depItem = self.getTargetProvider(dep);
                _arguments.push(_createSingleton(depItem));
            });
            return _makeValue(item, _arguments);
        };
        return _createSingleton(target);
    };
    Injector.prototype.get = function (token) {
        if (this.map.has(token)) {
            return this.map.get(token);
        }
        var singletonObj = this.createSingleton(token);
        this.map.set(token, singletonObj);
        return singletonObj;
    };
    Injector.resolveAndCreate = function (providers) {
        if (!is.array(providers)) {
            providers = [providers];
        }
        return new Injector(providers);
    };
    return Injector;
}());
exports.Injector = Injector;
