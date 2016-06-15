import Q from 'q';

import config from './config';


export default {
    parseData(item) {
        if (!item || !item.attachments) {
            return {};
        }

        item = item.attachments[0];

        return {
            name: item.title,
            description: item.text,
            imageUrl: item.thumb_url,
            websiteUrl: item.title_link
        };
    },

    getRandomPlace() {
        const url = `${config.apiHost}/random`;

        const deferred = Q.defer();
        const request = new XMLHttpRequest();
        request.open('POST', url, true);

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                const data = JSON.parse(request.responseText);
                const parsedData = this.parseData(data);

                deferred.resolve(parsedData);
            } else {
                deferred.reject(request.responseText);
            }
        };

        request.onerror = (reason) => {
            deferred.reject('There was a connection error', reason);
        };

        request.send();

        return deferred.promise;
    }
};
