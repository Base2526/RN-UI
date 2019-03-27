import Constant from './Constant'

export const upload_image = (uid, uri) => {
    console.log(uid, uri);
    var data = new FormData();
    data.append('idna', {
        uri: uri,
        name: 'imageName.png',
        type: 'image/png'
    });

    data.append("uid", uid);

    return fetch(Constant.URI_API + 'chat_upload_picture', {
        headers: {'Accept': 'application/json', 'Content-Type': 'multipart/form-data'},
        method: 'POST',
        body: data
    })
};

/*
Format support : "image/mp4", "video/mp4", "application/mp4"
Limit file : 50M
*/
export const upload_video = (uid, uri) => {
    var data = new FormData();
    data.append('idna', {
        uri: uri, // your file path string
        name: 'video.mp4',
        type: 'image/mp4'
    });

    data.append("uid", uid);

    console.log(Constant.URI_API + 'chat_upload_video', {
        headers: {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'},
        method: 'POST',
        body: data
    });

    return fetch(Constant.URI_API + 'chat_upload_video', {
        headers: {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'},
        method: 'POST',
        body: data
    })
}


export const upload_file = ({uid, uri, type, name}) => {
    console.log({uid, uri, type, name});
    var data = new FormData();
    data.append('idna', {
        uri,
        name,
        type
    });

    data.append("uid", uid);

    return fetch(Constant.URI_API + 'chat_upload_picture', {
        headers: {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'},
        method: 'POST',
        body: data
    })
}

export const load_messasge_more = (chatId, messageIdLast) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            'chatId': chatId,
            'messageIdLast': messageIdLast
        }),
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }

    return fetch(Constant.URI_API + 'chat_messasge_more', data)
        .then((response) => {
            return response.json()
        })
        .then((responseJson) => {
            return responseJson;
        })
};