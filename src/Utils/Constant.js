// let API_URL = 'http://139.59.228.56';

let API_URL = 'http://128.199.149.168';
let END_POINT = '/api';

module.exports = {
    API_URL,
    END_POINT,
    LOGIN: API_URL + END_POINT + '/login',
    LOGOUT: API_URL + END_POINT + '/logout',
    LOGIN_WITH_SOCIAL: API_URL + END_POINT + '/login_with_social',
    REGISTER: API_URL + END_POINT + '/user/register',
    FORGET_PASSWORD: API_URL + END_POINT + '/user/user_forgot_password',

    PEOPLE_YOU_MAY_KNOW: API_URL + END_POINT + '/people_you_may_know',
    ADD_FRIEND: API_URL + END_POINT + '/add_friend',

    CREATE_GROUP: API_URL + END_POINT + '/create_chat_group',
    CREATE_CLASS: API_URL + END_POINT + '/create_class',
    
    FETCH_HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Content-Type': 'multipart/form-data',
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
    TWITTER_CONSUMER_SECRET: "765FrNfImzNSWGKjbQSId3wI86EdiD7QxQKeJWSbhvqMMPTmCf",



    /*
    #define _FRIEND_STATUS_FRIEND            @"10"
    #define _FRIEND_STATUS_FRIEND_CANCEL     @"13"
    #define _FRIEND_STATUS_FRIEND_REQUEST    @"11"
    #define _FRIEND_STATUS_WAIT_FOR_A_FRIEND @"12"
    */

    // avatarSource.uri
    DEFAULT_AVATARSOURCE_URI: 'https://www.ricoh-europe.com/img/error.jpeg',

    FRIEND_STATUS_FRIEND: '10',
    FRIEND_STATUS_FRIEND_CANCEL: '13',
    FRIEND_STATUS_FRIEND_REQUEST: '11',
    FRIEND_STATUS_WAIT_FOR_A_FRIEND: '12',
};