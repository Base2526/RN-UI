// https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

let bundle_identifier= "th.dna";
let platform= "firebase";

let constants = {
    bundle_identifier,
    platform,
    headers : { 
        'bundle_identifier': bundle_identifier,
        'platform' : platform 
    },
    API_URL_IDNA: 'http://128.199.149.168',
    END_POINT_IDNA: '/api',
    PATH_API_TEST: '/api_test',
};

module.exports = Object.freeze(constants); 

/*
// Header 
// Refer : https://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module

var bundle_identifier = 'heart.idna';
var platform          = 'firebase';

var headers = { 
    'bundle_identifier': bundle_identifier,
    'platform' : platform 
};

var API_URL_IDNA 	= 'http://128.199.149.168';
var END_POINT_IDNA 	= '/api';

var PATH_API_TEST 	= '/api_test';
 */