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
