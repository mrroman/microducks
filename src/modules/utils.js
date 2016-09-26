const Utils = {
    cache(f) {
        let lastArgs = null,
        lastResult = null;

        return (...args) => {
            if (!lastArgs || !args.every((v,i) => lastArgs[i] === v)) {
                lastArgs = args;
                lastResult = f.apply(this, args);
            }

            return lastResult;
        };
    },

    // copyied from https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    assign(target) {
        'use strict';
        // We must check against these specific cases.
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    },

    merge(previous, next, setFunc, clearFunc) {
        let toClear = Object.keys(previous).filter((name) => {
                return (name in previous) && !(name in next);
            }),
            toSet = Object.keys(next).filter((name) => {
                return !(name in previous) || previous[name] !== next[name];
            });

        if (toSet.length === 0 && toClear.length === 0) {
            return;
        }

        toClear.forEach((name) => clearFunc(name, previous[name]));
        toSet.forEach((name) => setFunc(name, next[name], previous[name]));
    }
};
