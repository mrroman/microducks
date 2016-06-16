import * as MicroDucks from '../dist/microducks.js';
import {assert} from 'chai';

describe('caching', () => {

    it('executes function once for subsequent executions with the same argument', () => {
        let executionTimes = {};

        const f = MicroDucks.cache((x) => {
            executionTimes[x] = (executionTimes[x] || 0) + 1;
            return x.toUpperCase();
        });

        assert.equal(f('value1'), 'VALUE1');
        assert.equal(f('value1'), 'VALUE1');
        assert.equal(f('value2'), 'VALUE2');
        assert.equal(f('value2'), 'VALUE2');
        assert.equal(f('value1'), 'VALUE1');

        assert.equal(executionTimes['value1'], 2);
        assert.equal(executionTimes['value2'], 1);
    });

    it('works with multiple arguments', () => {
        let executionTimes = {};

        const f = MicroDucks.cache((x, y) => {
            executionTimes[x+y] = (executionTimes[x+y] || 0) + 1;
            return x.toUpperCase() + y.toUpperCase();
        });

        assert.equal(f('a','b'), 'AB');
        assert.equal(f('a','b'), 'AB');
        assert.equal(f('b','c'), 'BC');
        assert.equal(f('b','c'), 'BC');
        assert.equal(f('b','a'), 'BA');
        assert.equal(f('a','b'), 'AB');

        assert.equal(executionTimes['ab'], 2);
        assert.equal(executionTimes['bc'], 1);
        assert.equal(executionTimes['ba'], 1);
    });
});
