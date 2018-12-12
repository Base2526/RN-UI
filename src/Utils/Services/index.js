import Constant from '../Constant'

export const __test = (name) => {
    // let username = name.toLowerCase().trim();
    const URL = `https://api.github.com/users/${name}`;
    return fetch(URL)
            .then((res) => res.json());
};

export const login = (name, password) => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    return 'login function'
};

export const login_with_social = (name, password) => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    return 'login_with_social function'
};

export const logout = () => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    return 'logout function'
};

export const sign_up = () => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    return 'sign_up function'
};

export const forgot_password = () => {
    // let username = name.toLowerCase().trim();
    // const URL = `https://api.github.com/users/${name}`;
    // return fetch(URL)
    //         .then((res) => res.json());

    return 'forgot_password function'
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