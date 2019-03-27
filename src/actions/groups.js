import {
    GROUP_FETCHING,
    GROUP_FETCHED,
    GROUP_ERROR, GROUP_APPEND,
    GROUP_LAST_MESSAGE
} from './const';
import firebase from "react-native-firebase";

let unsubscribe, unsubscribeLastMessage = {};

const currentUser = () => {
    let currentUser = firebase.auth().currentUser;
    let user = firebase.firestore().collection('Users').doc(currentUser.uid);
    return user;
};

const getItems = async (lastDoc) => {
    try {
        let user = currentUser();
        let query = firebase.firestore()
            .collection("Groups")
            .where('Users', "array-contains", user)
            .limit(20);

        if (lastDoc) {
            query = firebase.firestore()
                .collection("Groups")
                .where('Users', "array-contains", user)
                .startAfter(lastDoc.data().updatedTimeStamp)
                .limit(20);
        }
        let items = [];
        if (user) {
            const snapshot = await query.get();
            items = snapshot.docs;
        }
        return items;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const subscribe = dispatch => {
    if (unsubscribe)
        unsubscribe();
    let user = currentUser();
    unsubscribe = firebase.firestore()
        .collection("Groups")
        .where('Users', "array-contains", user)
        .onSnapshot(function (snapshot) {
            let addedDocs = [];
            let modifiedDocs = [];
            snapshot.docChanges.forEach(function (change) {
                if (change.type === "added" && change.doc.data().updatedTimeStamp) {
                    addedDocs.push(change.doc);
                    subscribeLastMessage(dispatch, change.doc);
                }
                if (change.type === "modified" && change.doc.data().updatedTimeStamp) {
                    modifiedDocs.push(change.doc);
                    subscribeLastMessage(dispatch, change.doc);
                }
                if (change.type === "removed") {
                    console.log("Removed message: ", change.doc.data());
                }
            });
            if (addedDocs.length > 0)
                dispatch({type: GROUP_APPEND, items: addedDocs});
            if (modifiedDocs.length > 0)
                dispatch({type: GROUP_APPEND, items: modifiedDocs});
        });
};

const subscribeLastMessage = (dispatch, item) => {
    if (typeof unsubscribeLastMessage[item.id] === 'function')
        unsubscribeLastMessage[item.id]();
    unsubscribeLastMessage[item.id] = item.ref
        .collection("Messages")
        .orderBy('createdAt', 'DESC')
        .limit(1)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges.forEach(change => {
                if (change.type === "added") {
                    dispatch({type: GROUP_LAST_MESSAGE, group: item.id, change, message: change.doc});
                }
            });
        });
};

const list = (lastDoc) => {
    return async dispatch => {
        dispatch({type: GROUP_FETCHING});
        try {
            let items = await getItems(lastDoc);
            items = items.map(item => {
                if (item.data().updatedTimeStamp)
                    return item;
            }).filter(e => e);
            items.map(item => {
                subscribeLastMessage(dispatch, item);
            });
            subscribe(dispatch);
            dispatch({type: !lastDoc ? GROUP_FETCHED : GROUP_APPEND, items});
        } catch (error) {
            console.log(error);
            dispatch({type: GROUP_ERROR, error});
        }
    };
};

module.exports = {
    list
};
