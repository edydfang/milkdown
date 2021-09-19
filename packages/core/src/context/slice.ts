/* Copyright 2021, Milkdown by Mirone. */
import { ctxCallOutOfScope } from '@milkdown/exception';

import { shallowClone } from '../utility';

export type $Slice<T = unknown> = {
    id: symbol;
    set: (value: T) => void;
    get: () => T;
    update: (updater: (prev: T) => T) => void;
};

export type SliceMap = Map<symbol, $Slice>;

export type Slice<T> = {
    id: symbol;
    _typeInfo: () => T;
    (container: SliceMap, resetValue?: T): $Slice<T>;
};

export const createSlice = <T>(value: T): Slice<T> => {
    const id = Symbol('Context');

    const factory = (container: SliceMap, resetValue = shallowClone(value)) => {
        let inner = resetValue;

        const context: $Slice<T> = {
            id,
            set: (next) => {
                inner = next;
            },
            get: () => inner,
            update: (updater) => {
                inner = updater(inner);
            },
        };
        container.set(id, context as $Slice);
        return context;
    };
    factory.id = id;
    factory._typeInfo = (): T => {
        throw ctxCallOutOfScope();
    };

    return factory;
};
