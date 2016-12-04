import "reflect-metadata";

import { innerDependenceMetadataKey } from './symbol';
import { getOwnMetadata } from './util';
import { Injector } from './Injector';

export { Injector };

export const Inject = token => target => {
    let existingInnerDependenceMetadataKey: string[] = getOwnMetadata(innerDependenceMetadataKey, target) || [];
    // 这个顺序很奇怪相反的
    existingInnerDependenceMetadataKey.unshift(token);
    Reflect.defineMetadata(innerDependenceMetadataKey, existingInnerDependenceMetadataKey, target);
}



