import {Platform} from 'react-native'
// import RNFetchBlob from 'react-native-fetch-blob'

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
        .then((response) =>{
            console.log(response)
            return response.json()
        })
        .then((responseJson) => {
            console.log(responseJson)
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

export const people_you_may_khow = (uid) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'uid': uid,
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

export const invite_friend = (uid, friend_id) =>{
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

    return fetch(Constant.INVITE_FRIEND, data)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

export const create_group = (uid, group_name, members, uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: uri, // your file path string
        name: 'imageName.png',
        type: 'image/png'
    })

    data.append("uid", uid)
    data.append("name", group_name)
    data.append('members', JSON.stringify(members))

    return fetch(Constant.CREATE_GROUP, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
      }).then((response) => {
          return response.json()
      }).then((responseJson) => {
          return responseJson;
      }).catch((error) => {
        return {'status': false, 'message': error}
      })
}

export const create_class = (uid, class_name, members, uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: uri, // your file path string
        name: 'imageName.png',
        type: 'image/png'
    })
    data.append("uid", uid)
    // data.append("fction", 'add')
    data.append("name", class_name)
    data.append('members', JSON.stringify(members))

    return fetch(Constant.CREATE_CLASS, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        return responseJson;
    }).catch((error) => {
        return {'status': false, 'message': error}
    })
}

/*
    กรณีที่เพิ่มเพือนใน class เพิ่ม
*/
// export const class_add_member = (uid, class_id, members) =>{
//     var data = new FormData();
//     data.append("mode", 'added')
//     data.append("uid", uid)
//     data.append("class_id", class_id)
//     data.append('members', JSON.stringify(members))

//     return fetch(Constant.CLASS_MEMBER, {
//         headers: Constant.FETCH_HEADERS,
//         method: 'POST',
//         body: data
//     }).then((response) => {
//         return response.json()
//     }).then((responseJson) => {
//         return responseJson;
//     }).catch((error) => {
//         return {'status': false, 'message': error}
//     })
// }

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

export const create_my_application = (uid, application_name, category, subcategory, uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: uri, // your file path string
        name: 'imageName.png',
        type: 'image/png'
    })
    data.append("uid", uid)
    data.append("name", application_name)
    data.append("category", category)
    data.append("subcategory", subcategory)

    return fetch(Constant.CREATE_MY_APPLICATION, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
    }).then((response) => {
        // console.log(response)
        return response.json()
    }).then((responseJson) => {
        // console.log(responseJson)
        return responseJson;
    }).catch((error) => {
        return {'status': false, 'message': error}
    })
}

export const application_category = () =>{
    let data = {
        method: 'POST',
        body: JSON.stringify({
            // 'uid': '1',
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.APPLICATION_CATEGORY, data)
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson)
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

export const update_picture_profile  = (uid, image_uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: image_uri, 
        name: 'imageName.png',
        type: 'image/png'
    })
    data.append("uid", uid)

    return fetch(Constant.UPDATE_PICTURE_PROFILE, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        return responseJson;
    }).catch((error) => {
    return {'status': false, 'message': error}
    })
}

export const update_picture_bg_profile  = (uid, image_uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: image_uri, 
        name: 'imageName.png',
        type: 'image/png'
    })
    data.append("uid", uid)

    console.log(data)

    // return {'status': false, 'message': 'test'}
    return fetch(Constant.UPDATE_PICTURE_BG_PROFILE, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        return responseJson;
    }).catch((error) => {
        return {'status': false, 'message': error}
    })
}

export const update_group_picture_profile = (uid, group_id, image_uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: image_uri, 
        name: 'imageName.png',
        type: 'image/png'
    })
    data.append("uid", uid)
    data.append("group_id", group_id)

    return fetch(Constant.UPDATE_GROUP_PICTURE_PROFILE, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        return responseJson;
    }).catch((error) => {
        return {'status': false, 'message': error}
    })
}

export const check_my_id = (uid, type, id) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'uid':uid,
            'type':type,
            'id':id,
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.CHECK_MY_ID, data)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

export const scan_qrcode = (uid, qe) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'uid':uid,
            'qe':qe
        }),
        headers: Constant.FETCH_HEADERS
    }

    return fetch(Constant.SCAN_QRCODE, data)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        }).catch((error) => {
            console.error(error);
        });
}

export const update_class_picture_profile = (uid, class_id, image_uri) =>{
    var data = new FormData();
    data.append('idna', {
        uri: image_uri, 
        name: 'imageName.png',
        type: 'image/png'
    })
    data.append("uid", uid)
    data.append("class_id", class_id)

    return fetch(Constant.UPDATE_CLASS_PICTURE_PROFILE, {
        headers: Constant.FETCH_HEADERS,
        method: 'POST',
        body: data
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        return responseJson;
    }).catch((error) => {
        return {'status': false, 'message': error}
    })
}