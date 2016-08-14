import * as MicroDucks from 'microducks';
import { el, text } from 'microducks';

import lunchFinderService from './lunch-finder.service';
import mockedPlace from './mocked/place.json';


const store = MicroDucks.Store.create({
    place: mockedPlace
});


// Helpers
// ----------------------------------------------------------------------------

const clickHandler = () => {
    lunchFinderService.getRandomPlace().then(
        (data) => {
            store.dispatch('new-place', data);
        },
        (reason) => {
            return new Error(reason);
        }
    );
};


// Elements
// ----------------------------------------------------------------------------
const buttonElement = () => {
    return el('section')
        .prop('className', 'box container')
        .body(
            el('button')
            .prop('className', 'button button--sacnite')
            .body(text('Get another place'))
            .on('click', clickHandler)
        );
};

const placeElement = MicroDucks.Utils.cache((item) => {
    return el('section')
        .prop('className', 'feed clearfix')
        .body(
            el('h2')
            .prop('className', 'feed__title')
            .body(
                el('a')
                .prop('href', item.websiteUrl)
                .body(text(item.name))
                ),
            el('img')
            .prop('className', 'feed__image')
            .prop('src', item.imageUrl)
            .body(),
            el('p')
            .prop('className', 'feed_description')
            .body(text(item.description))
        );
});

const lunchFinder = (data) => {
    return el('div')
        .prop('className', 'container')
        .body(
            buttonElement(),
            placeElement(data.place)
        );
};

// Merger
// ----------------------------------------------------------------------------
const app = MicroDucks.VDOM.createMerger('js-app');
app(lunchFinder(store.data));

// Store
// ----------------------------------------------------------------------------
store.subscribe((data) => {
    app(lunchFinder(data));
});

store.handle('new-place', (data, newPlace) => {
    data.place = newPlace;
    return data;
});
