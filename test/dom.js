import {DOM, Views} from '../dist/microducks.js';
import {assert} from 'chai';

describe('vdom', () => {

    var root;

    beforeEach(() => {
        root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
    });

    it('merge simple view with static text', () => {
        let simpleView = Views.el('div', 'text');
        let root = DOM.update('root', simpleView);

        assert.equal(root.childNodes.length, 1);
        assert.equal(root.childNodes[0].textContent, 'text');
    });

    it('merge simple view with two nested elements', () => {
        let simpleView = Views.el('div').has(Views.el('span'), Views.el('span'));
        let root = DOM.update('root', simpleView);

        assert.equal(root.childNodes.length, 2);
        assert.equal(root.childNodes[0].nodeName, 'SPAN');
        assert.equal(root.childNodes[1].nodeName, 'SPAN');
    });

    it('merge simple view with property', () => {
        let simpleView = Views.el('div').prop('className', 'blue');
        let root = DOM.update('root', simpleView);

        assert.equal(root.className, 'blue');
    });

    it('merge simple view with property', () => {
        let simpleView = Views.el('div').prop('className', 'blue');
        let root = DOM.update('root', simpleView);

        assert.equal(root.className, 'blue');
    });

    it('merge simple view with nested element with property', () => {
        let simpleView = Views.el('div').has(Views.el('span').prop('className', 'blue'));
        let root = DOM.update('root', simpleView);

        assert.equal(root.childNodes[0].className, 'blue');
    });

    it('merge simple view with nested element with listener', () => {
        let check = false;
        let simpleView = Views.el('div').has(Views.el('span')
                                        .prop('id', 'click')
                                        .on('click', () => { check = true; }));

        DOM.update('root', simpleView);
        document.getElementById('click').click();

        assert.equal(check, true);
    });

    it('merge simple view and overwrite it with other simple view', () => {
        let simpleView = Views.el('div', 'aaa');
        let differentView = Views.el('ul').has(Views.el('li'), Views.el('li'));

        let root = DOM.update('root', simpleView);
        root = DOM.update('root', differentView);

        assert.equal(root.nodeName, 'UL');
        assert.equal(root.childNodes.length, 2);
        assert.equal(root.childNodes[0].nodeName, 'LI');
        assert.equal(root.childNodes[1].nodeName, 'LI');
    });

    it('merge simple view and overwrite it keeping nodes', () => {
        let simpleView = Views.el('div').has(Views.el('span', 'aaa'));
        let differentView = Views.el('div').has(Views.el('span', 'bbb'));

        let root = DOM.update('root', simpleView);
        let spanNode = root.childNodes[0];

        DOM.update('root', differentView);
        assert.equal(root.childNodes[0], spanNode);
    });

});
