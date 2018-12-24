import {Platform} from 'react-native'
import Constant from '../Constant'

export const login = (name, pass) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'name': name,
            'pass': pass
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.LOGIN, data)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
};

export const login_with_social = (type, value) => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    // LOGIN_WITH_SOCIAL

    /*
    type
    data
     */

    let data = {
        method: 'POST',
        body: JSON.stringify({
            'type': type,
            'data': value
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.LOGIN_WITH_SOCIAL, data)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
};

export const logout = () => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    return 'logout function > ' + Constant.LOGOUT
};

export const register = (mail, pass) => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    // ?udid=%@&platform=ios&bundleidentifier=%@&version=%@

    // ?udid='udid'&platform=ios&bundleidentifier='bundleidentifier'&version='1.0'


    /**
    @"name": username,
    @"pass": @"1234",
    @"mail": email,
    @"udid": [[Configs sharedInstance] getUniqueDeviceIdentifierAsString],
    @"platform" : @"ios",
    @"bundleidentifier" : [[Configs sharedInstance] getBundleIdentifier],
    @"version" : [[Configs sharedInstance] getVersionApplication]
      */
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'name': 'name',
            'pass': pass,
            'mail': mail,
            'udid': 'udid',
            'platform': Platform.OS,
            'bundleidentifier': 'bundleidentifier',
            'version': '1.0'
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.REGISTER + "?udid='udid'&platform=ios&bundleidentifier='bundleidentifier'&version='1.0'", data)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
};

export const forget_password = (mail) => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());
    // 

    let data = {
        method: 'POST',
        body: JSON.stringify({
            'mail': mail,
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.FORGET_PASSWORD, data)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
};


/*
https://stackoverflow.com/questions/35140358/react-native-fetch-post-request-is-sending-as-get-request
let data = {
  method: 'POST',
  credentials: 'same-origin',
  mode: 'same-origin',
  body: JSON.stringify({
    appoid: appo_id
  }),
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken':  cookie.load('csrftoken')
  }
}
return fetch('/appointments/get_appos', data)
        .then(response => response.json())  // promise
        .then(json => dispatch(receiveAppos(json)))
} 
 */

export const people_you_may_khow = () => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'uid': '1',
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.PEOPLE_YOU_MAY_KNOW, data)
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson)
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

export const add_friend = (uid, friend_id) =>{
    // ADD_FRIEND

    // @"uid":[[Configs sharedInstance] getUIDU], @"friend_id":friend_id
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'uid': uid,
            'friend_id': friend_id
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.ADD_FRIEND, data)
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson)
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

// CREATE_GROUP
export const create_group = (uid, group_name, members, uri) =>{

    let body = new FormData();
    body.append('photo', {uri: uri,name: 'photo.png',filename :'imageName.png',type: 'image/png'});
    body.append('Content-Type', 'image/png');
    body.append('name', group_name); 
    
    return fetch(Constant.CREATE_GROUP,{ method: 'POST',
        headers:{  
        // "Content-Type": "multipart/form-data",
        // "otherHeader": "foo",
        
        'Accept': 'application/json',
        // 'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
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
        } 
        , body :JSON.stringify(body)} )
    // .then((response) => response.json())
     .then((res) => res.json())
     .then((res) => { 
         console.log("response" +JSON.stringify(res)); 
    })
     .catch((e) => console.log(e))



    const data = new FormData();
    data.append('uid', uid); // you can append anyone.
    data.append('name', group_name); // you can append anyone.
    data.append('members', members);
    data.append('idna', {
    uri: uri,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName'
    });

    // @"uid":[[Configs sharedInstance] getUIDU], @"friend_id":friend_id
    let ___ = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.CREATE_GROUP, ___)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

export const search_google = (textSearch) => {
    return fetch('https://www.googleapis.com/customsearch/v1?key=AIzaSyDAVMdipuafrh2sfZbwDL7smEsk0HJrgHs&cx=011532986475707227508:bsrvzot-rza&q=' + textSearch)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
};