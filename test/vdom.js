import sinon from 'sinon';
import {VDOM, el, text} from '../dist/microducks.js';
import {assert} from 'chai';

describe('vdom', function() {

    var root;

    beforeEach(() => {
        root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
    });

    it('merge simple view with static text', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div', 'text');

        merger(simpleView);

        assert.equal(merger.origin.childNodes.length, 1);
        assert.equal(merger.origin.childNodes[0].textContent, 'text');
    });

    it('merge simple view with two nested elements', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div').has(el('span'), el('span'));

        merger(simpleView);

        assert.equal(merger.origin.childNodes.length, 2);
        assert.equal(merger.origin.childNodes[0].nodeName, 'SPAN');
        assert.equal(merger.origin.childNodes[1].nodeName, 'SPAN');
    });

    it('merge simple view with property', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div').prop('className', 'blue');

        merger(simpleView);

        assert.equal(merger.origin.className, 'blue');
    });

    it('merge simple view with property', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div').prop('className', 'blue');

        merger(simpleView);

        assert.equal(merger.origin.className, 'blue');
    });

    it('merge simple view with nested element with property', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div').has(el('span').prop('className', 'blue'));

        merger(simpleView);

        assert.equal(merger.origin.childNodes[0].className, 'blue');
    });

    it('merge simple view with nested element with listener', () => {
        let merger = VDOM.createMerger('root');
        let check = false;
        let simpleView = el('div').has(el('span')
                                        .prop('id', 'click')
                                        .on('click', () => { check = true; }));

        merger(simpleView);
        document.getElementById('click').click();

        assert.equal(check, true);
    });

    it('merge simple view and overwrite it with other simple view', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div', 'aaa');
        let differentView = el('ul').has(el('li'), el('li'));

        merger(simpleView);
        merger(differentView);

        assert.equal(merger.origin.nodeName, 'UL');
        assert.equal(merger.origin.childNodes.length, 2);
        assert.equal(merger.origin.childNodes[0].nodeName, 'LI');
        assert.equal(merger.origin.childNodes[1].nodeName, 'LI');
    });

    it('merge simple view and overwrite it keeping nodes', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div').has(el('span', 'aaa'));
        let differentView = el('div').has(el('span', 'bbb'));

        merger(simpleView);
        let spanNode = merger.origin.childNodes[0];

        merger(differentView);
        assert.equal(merger.origin.childNodes[0], spanNode);
    });

    it('merge simple view and overwrite it keeping nodes', () => {
        let merger = VDOM.createMerger('root');
        let simpleView = el('div').has(el('span', 'aaa'));
        let differentView = el('div').has(el('span', 'bbb'));

        merger(simpleView);
        let spanNode = merger.origin.childNodes[0];

        merger(differentView);
        assert.equal(merger.origin.childNodes[0], spanNode);
    });

});
