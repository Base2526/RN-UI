import {
    MESSAGE_FETCHING,
    MESSAGE_FETCHED,
    MESSAGE_FETCHED_RESET,
    MESSAGE_ERROR,
    MESSAGE_APPEND,
    MESSAGE_PREPEND
} from './const';
import firebase from "react-native-firebase";
import {Alert, Platform} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import {upload_image, upload_video} from '../helpers/Api';

let unsubscribe;

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const uploadImage = (file, fileType) => {
    let imageFile = file.uri;
    imageFile = (Platform.OS === 'ios') ? imageFile.replace('file://', '') : imageFile;
    if (fileType === 'image')
        return upload_image(uuidv4(), imageFile)
    else if (fileType === 'video')
        return upload_video(uuidv4(), imageFile)
    // return RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/dnachat/' + fileType + '/upload?upload_preset=jkrl7fxc', {
    //     'Content-Type': 'multipart/form-data'
    // }, [
    //     {name: 'file', filename: file.fileName, data: RNFetchBlob.wrap(imageFile)}
    // ]);
};

const getItems = async (group, lastDoc) => {
    try {
        let query = group.ref
            .collection("Messages")
            .orderBy("createdAt", "DESC")
            .limit(20);

        if (lastDoc) {
            query = group.ref
                .collection("Messages")
                .orderBy("createdAt", "DESC")
                .startAfter(lastDoc.data().createdAt)
                .limit(20);
        }
        const snapshot = await query.get();
        const items = snapshot.docs;
        return items;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const list = (group, lastDoc) => {
    return async dispatch => {
        dispatch({type: MESSAGE_FETCHING});
        try {
            let items = await getItems(group, lastDoc);
            dispatch({type: !lastDoc ? MESSAGE_FETCHED : MESSAGE_APPEND, items, group});
        } catch (error) {
            console.log(error);
            dispatch({type: MESSAGE_ERROR, error});
        }
    };
};

const prepend = (docs, group) => {
    return async dispatch => {
        dispatch({type: MESSAGE_PREPEND, items: docs, group});
    };
};

const subscribe = (group) => {
    return async dispatch => {
        if (unsubscribe)
            unsubscribe();
        unsubscribe = group.ref
            .collection("Messages")
            .where('createdAt', '>', new Date())
            .onSnapshot(function (snapshot) {
                let addedDocs = [];
                let modifiedDocs = [];
                snapshot.docChanges.forEach(function (change) {
                    if (change.type === "added") {
                        addedDocs.push(change.doc);
                    }
                    if (change.type === "modified") {
                        modifiedDocs.push(change.doc);
                    }
                    if (change.type === "removed") {
                        console.log("Removed message: ", change.doc.data());
                    }
                });
                if (addedDocs.length > 0)
                    dispatch({type: MESSAGE_PREPEND, items: addedDocs, group});
                if (modifiedDocs.length > 0)
                    dispatch({type: MESSAGE_PREPEND, items: modifiedDocs, group});
            });
    };
};

const addFile = (group, response, fileType = 'image') => {
    return async dispatch => {
        let messageId = uuidv4();
        let currentUser = firebase.auth().currentUser;
        let userDoc = firebase.firestore().collection('Users').doc(currentUser.uid);
        let data = {
            _id: messageId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploading: true,
            user: userDoc
        };
        switch (fileType) {
            case 'image':
                data.image = response.uri;
                break;
            case 'video':
                data.video = response.uri;
                break;
        }
        dispatch({type: MESSAGE_PREPEND, items: [data], group});
        try {
            let fetchResponse = await uploadImage(response, fileType);
            console.log(fetchResponse);
            let json = await fetchResponse.json();
            if (fetchResponse.status === 200) {
                let ref = group.ref.collection("Messages").doc(messageId);
                delete data.uploading;
                let images = json.data;

                switch (fileType) {
                    case 'image':
                        ref.set({
                            ...data,
                            image_thumbnail: images.thumbnail_url,
                            image: images.original_url
                        });
                        break;
                    case 'video':
                        ref.set({
                            ...data,
                            image_thumbnail: images.thumbnail_url,
                            video: images.video_url
                        });
                        break;
                }
            } else {
                console.warn('messages.js', json);
                Alert.alert("Error", JSON.stringify(json));
            }
        } catch (err) {
            console.warn('messages.js', err.message);
            Alert.alert("Error", err.message);
        }
    }
};

const addSticker = (group, sticker) => {
    return async dispatch => {
        let messageId = uuidv4();
        let currentUser = firebase.auth().currentUser;
        let userDoc = firebase.firestore().collection('Users').doc(currentUser.uid);
        let ref = group.ref.collection("Messages").doc(messageId);
        ref.set({
            _id: messageId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            image: sticker,
            type: 'sticker',
            user: userDoc
        });
    }
}

module.exports = {
    list,
    subscribe,
    prepend,
    addFile,
    addSticker
};
