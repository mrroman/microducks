import * as MicroDucks from 'microducks';
import { el, text } from 'microducks';

import lunchFinderService from './lunch-finder.service';
import mockedPlace from './mocked/place.json';


const store = MicroDucks.createStore({
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
        .attr('class', 'box container')
        .body(
            el('button')
            .attr('class', 'button button--sacnite')
            .body(text('Get another place'))
            .on('click', clickHandler)
        );
};

const placeElement = MicroDucks.cache((item) => {
    return el('section')
        .attr('class', 'feed clearfix')
        .body(
            el('h2')
            .attr('class', 'feed__title')
            .body(
                el('a')
                .attr('href', item.websiteUrl)
                .body(text(item.name))
                ),
            el('img')
            .attr('class', 'feed__image')
            .attr('src', item.imageUrl)
            .body(),
            el('p')
            .attr('class', 'feed_description')
            .body(text(item.description))
        );
});


// Mount
// ----------------------------------------------------------------------------
const app = MicroDucks.mount('js-app', (props) => {
    return el('div')
        .attr('class', 'container')
        .body(
            buttonElement(),
            placeElement(props.place)
        );
}, store.data);


// Store
// ----------------------------------------------------------------------------
store.subscribe((data) => {
    app(data);
});

store.handle('new-place', (data, newPlace) => {
    data.place = newPlace;
    return data;
});
