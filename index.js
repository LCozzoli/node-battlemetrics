'use strict';

const axios = require("axios");
axios.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = (key, ignoreRates = false) => {
    if (!key) return Battlemetrics;
    return new Battlemetrics(key, ignoreRates);
};

class Battlemetrics {

    constructor(key, ignoreRates = false) {
        if (!key) 
            throw 'API key required';
        this.ignoreRates = ignoreRates;
        this.axios = axios.create({
            baseURL: 'https://api.battlemetrics.com',
            timeout: 2000,
            headers: {'Authorization': `Bearer ${key}`}
        });
    }

    request(method, url, data)
    {
        return new Promise((resolve, reject) => {
            let construct = {
                method: method,
                url: url
            };
            if (method == "post" && data)
                construct.data = { data: data };
            if (method == "get" && data)
                construct.params = data;
            this.axios(construct)
            .then(function (response) {
                console.log(response);
                if (response && response.data)
                    return resolve(response.data);
                reject(response);
            })
            .catch(function (error) {
                return reject(error);
            });
        });
    };

    playersMatch(type, identifier)
    {
        return this.request('post', 'players/match', [{
            "type": "identifier",
            "attributes": {
                "type": type,
                "identifier": identifier
            }
        }]);
    }

    serverInfo(serverId)
    {
        return this.request('get', `servers/${serverId}`, { include: 'player' });
    }
}



