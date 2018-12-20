let API_URL = 'http://139.59.228.56';
let END_POINT = '/api';

module.exports = {
    LOGIN: API_URL + END_POINT + '/login',
    LOGOUT: API_URL + END_POINT + '/logout',
    LOGIN_WITH_SOCIAL: API_URL + END_POINT + '/login_with_social',
    REGISTER: API_URL + END_POINT + '/user/register',
    FORGET_PASSWORD: API_URL + END_POINT + '/user/user_forgot_password',

    FETCH_HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'version_os': 'version_os',
        'system_name': 'system_name',
        'device_name': 'device_name',
        'bundle_identifier': 'bundle_identifier',
        'platform': 'ios',
        'version_application': '1.0',
        'udid': 'udid',
        'model_number': 'model_number',
        'build': '1',
        'token_notification': 'token_notification',
        'token_pushkit': 'token_pushkit',
    },

    //AsyncStorage key
    USER_LOGIN:'user_login',
    PROVIDERS:{
        USER:'user',
        GOOGLE: 'google',
        FACEBOOK: 'facebook',
        TWITTER: 'twitter',
    },
    TWITTER_COMSUMER_KEY: "a7SsmDvq3XwzSN0za5uokCiBT",
    TWITTER_CONSUMER_SECRET: "765FrNfImzNSWGKjbQSId3wI86EdiD7QxQKeJWSbhvqMMPTmCf"
};