import firebase from "react-native-firebase";
import {CONTACT_FETCHING, CONTACT_POP, MESSAGE_PREPEND} from "./const";
import {CONTACT_FETCHED} from "./const";
import {CONTACT_ERROR} from "./const";
import {CONTACT_APPEND} from "./const";

let unsubscribe;

const getItems = async (lastDoc) => {
    try {
        let currentUser = firebase.auth().currentUser;
        let UserRef = firebase.firestore().collection('Users').doc(currentUser.uid);
        let query = UserRef
            .collection("Contacts")
            .orderBy("createdAt", "DESC")
            .limit(20);

        if (lastDoc) {
            query = UserRef
                .collection("Contacts")
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

const list = (lastDoc) => {
    return async dispatch => {
        dispatch({type: CONTACT_FETCHING});
        try {
            let items = await getItems(lastDoc);
            dispatch({type: !lastDoc ? CONTACT_FETCHED : CONTACT_APPEND, items});
        } catch (error) {
            console.log(error);
            dispatch({type: CONTACT_ERROR, error});
        }
    };
};

const subscribe = () => {
    return async dispatch => {
        if (unsubscribe)
            unsubscribe();
        let currentUser = firebase.auth().currentUser;
        let UserRef = firebase.firestore().collection('Users').doc(currentUser.uid);
        unsubscribe = UserRef
            .collection("Contacts")
            .onSnapshot(function (snapshot) {
                let addedDocs = [];
                let modifiedDocs = [];
                let removedDocs = [];
                snapshot.docChanges.forEach(function (change) {
                    if (change.type === "added") {
                        addedDocs.push(change.doc);
                    }
                    if (change.type === "modified") {
                        modifiedDocs.push(change.doc);
                    }
                    if (change.type === "removed") {
                        removedDocs.push(change.doc);
                    }
                });
                if (addedDocs.length > 0)
                    dispatch({type: CONTACT_APPEND, items: addedDocs});
                if (modifiedDocs.length > 0)
                    dispatch({type: CONTACT_APPEND, items: modifiedDocs});
                if (removedDocs.length > 0)
                    dispatch({type: CONTACT_POP, items: removedDocs});
            });
    };
};

const append = (items) => {
    return async dispatch => {
        dispatch({type: CONTACT_APPEND, items});
    }
};

module.exports = {
    list,
    append,
    subscribe
};
