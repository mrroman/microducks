import sinon from 'sinon';
import {Utils} from '../dist/microducks.js';
import {assert} from 'chai';

describe('caching', () => {

    it('executes function once for subsequent executions with the same argument', () => {
        let executionTimes = {};

        const f = Utils.cache((x) => {
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

        const f = Utils.cache((x, y) => {
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

describe('merging', () => {

    it('set property if not existed in prev', () => {
        const prev = {},
              next = {'checked': true};

        const setF = sinon.spy(),
              clearF = sinon.spy();

        Utils.merge(prev, next, setF, clearF);
        assert.isTrue(setF.called, 'setF called');
        assert.isFalse(clearF.called, 'clearF not called');
    });

    it('set property on change', () => {
        const prev = {'checked': false},
              next = {'checked': true};

        const setF = sinon.spy(),
              clearF = sinon.spy();

        Utils.merge(prev, next, setF, clearF);
        assert.isTrue(setF.called, 'setF called');
        assert.isFalse(clearF.called, 'clearF not called');
    });

    it('clear property if not in next', () => {
        const prev = {'checked': false},
              next = {};

        const setF = sinon.spy(),
              clearF = sinon.spy();

        Utils.merge(prev, next, setF, clearF);
        assert.isFalse(setF.called, 'setF not called');
        assert.isTrue(clearF.called, 'clearF called');
    });

    it('do nothing if no change', () => {
        const prev = {'checked': false},
              next = {'checked': false};

        const setF = sinon.spy(),
              clearF = sinon.spy();

        Utils.merge(prev, next, setF, clearF);
        assert.isFalse(setF.called, 'setF not called');
        assert.isFalse(clearF.called, 'clearF not called');
    });

    it('executes set function with prop name, new value and old value', () => {
        const prev = {'checked': false},
              next = {'checked': true};

        const setF = sinon.spy(),
              clearF = sinon.spy();

        Utils.merge(prev, next, setF, clearF);
        assert.isTrue(setF.calledWith('checked', true, false), 'setF called');
    });

    it('executes clear function with prop name and old value', () => {
        const prev = {'checked': false},
              next = {};

        const setF = sinon.spy(),
              clearF = sinon.spy();

        Utils.merge(prev, next, setF, clearF);
        assert.isTrue(clearF.calledWith('checked', false), 'setF called');
    });
});
