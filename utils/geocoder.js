const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'LrS4AOZpFgKfmyzzKM82ixPhf8k1m4jy',
    formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
