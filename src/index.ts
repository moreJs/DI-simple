import "reflect-metadata";

import { innerDependenceMetadataKey } from './symbol';
import { getOwnMetadata } from './util';
import { Injector } from './Injector';

export { Injector };

export const Inject = token => target => {
    let existingInnerDependenceMetadataKey: string[] = getOwnMetadata(innerDependenceMetadataKey, target) || [];
    existingInnerDependenceMetadataKey.push(token);
    Reflect.defineMetadata(innerDependenceMetadataKey, existingInnerDependenceMetadataKey, target);
}



