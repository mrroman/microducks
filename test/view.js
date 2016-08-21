import sinon from 'sinon';
import {VDOM, el, text} from '../dist/microducks.js';
import {assert} from 'chai';

describe('view', () => {
    it('create element is empty', () => {
        let v = el('div');

        assert.equal(v.type, 'tag');
        assert.equal(v.name, 'div');
        assert.equal(Object.keys(v.listeners).length, 0, 'empty listeners');
        assert.equal(Object.keys(v.props).length, 0, 'empty props');
        assert.equal(v.body.length, 0, 'empty body');
    });

    it('create element with static text', () => {
        let v = el('div', 'hello');

        assert.equal(v.type, 'tag');
        assert.equal(v.name, 'div');
        assert.equal(Object.keys(v.listeners).length, 0, 'empty listeners');
        assert.equal(Object.keys(v.props).length, 0, 'empty props');
        assert.equal(v.body.length, 1);
        assert.equal(v.body[0].text, 'hello');
    });

    it('create element with child views', () => {
        let v = el('div').has(el('span'), el('span'));

        assert.equal(v.type, 'tag');
        assert.equal(v.name, 'div');
        assert.equal(v.body.length, 2);
        assert.equal(v.body[0].name, 'span');
        assert.equal(v.body[1].name, 'span');
    });

    it('append to element if true', () => {
        let v1 = el('div').hasIf(true, el('span'));
        let v2 = el('div').hasIf(false, el('span'));

        assert.equal(v1.body.length, 1);
        assert.equal(v2.body.length, 0);
    });

    it('set prop to element if true', () => {
        let v1 = el('div').propIf(true, 'className', 'show');
        let v2 = el('div').propIf(false, 'className', 'show');

        assert.equal(v1.props.className, 'show');
        assert.isDefined(v1.props['className']);
    });

});
