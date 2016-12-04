import * as is from 'is';

import { innerDependenceMetadataKey } from './symbol';
import { getOwnMetadata } from './util';

/** 注射器 */
export class Injector{
    constructor(providers) {
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
    normalize(providers) {
        return providers.map(provider => {
            provider = provider || {};
            if(!provider.provider) {
                provider = {
                    token: provider.name,
                    useClass: provider,
                    deps: getOwnMetadata(innerDependenceMetadataKey, provider)
                };
            }
            return provider;
        });
    }
    
    /**最重要的方法：
        1: 检查是否是循环引用
     */
    judgeIsCycleDeps(provider) {
        let self = this;
        // 依赖表 
        let depsMap = new Map();
        // 默认为false
        let isCycleDeps = false;

        // deps 是以 token 的形式
        const _judgeIsCycleDepsByDeps = deps => {
            // 若已经循环依赖，直接返回
            if(isCycleDeps){
                return;
            }
            deps.forEach(depToken => {
                // 先找到 item, 依据 token
                let item = self.getTargetProvider(depToken);
                _judgeIsCycleDepsBySelf(item)
            });
        };
        // 接受的是 item
        const _judgeIsCycleDepsBySelf = item => {
            let { token, deps } = item;
            let has = depsMap.has(token);
            // 说明已经循环引用了
            if(has || isCycleDeps) { 
                isCycleDeps = true;
                return; 
            }
            // 没有依赖的，不用记录到依赖表中
            if(!deps || deps.length == 0) {
                return;
            }
            // 有依赖的，并且依赖表中没有的，记录在表中
            depsMap.set(token, deps);
            _judgeIsCycleDepsByDeps(deps);
        };

        _judgeIsCycleDepsBySelf(provider);
        return isCycleDeps;
    }

    getTargetProvider(token) {
        let ret = this.providers.filter(item => item.token === token);
        return ret && ret[0];
    }
    createSingleton(token) {
        let self = this;

        let target = this.getTargetProvider(token);
        let isCycleDeps = this.judgeIsCycleDeps(target);

        if(isCycleDeps) {
            throw `${token} 存在循环饮用`;
        }

        const _makeValue = (item, deps) => {
            let { token, useClass, useValue, useFactory} = item;
            if(useClass) {
                return new useClass(...deps);
            }else if(useValue) {
                return useValue;
            }else if(useFactory) {
                // to do paramteres
                return useFactory(deps);
            }else{
                throw `${token} provider 是非法的`;
            }   
        }
        // 接受的是item, 创建对象
        const _createSingleton = item => {
            let { token, useClass, useValue, useFactory, deps} = item;
            if(!deps || deps.length == 0) {
                return _makeValue(item);
            }
            let _arguments = [];
            deps.forEach(dep => {
                let depItem = self.getTargetProvider(dep);
                _arguments.push(_createSingleton(depItem));
            });
            return _makeValue(item, _arguments);
        };

        return _createSingleton(target);
    }

    get(token) {
        if(this.map.has(token)) {
            return this.map.get(token);
        }
        let singletonObj = this.createSingleton(token);
        this.map.set(token, singletonObj);
        return singletonObj;
    }

    static resolveAndCreate(providers){
        if(!is.array(providers)) {
            providers = [providers];
        }
        return new Injector(providers);
    }
}
