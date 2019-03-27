import firebase from "react-native-firebase";

const usersStorage = require('./usersStorage');

const getUsersExceptCurrent = async group => {
    try {
        let currentUser = firebase.auth().currentUser;
        let userArr = [];
        let users = group.data().Users;
        let promises = users.map(async user => {
            user = await usersStorage(user);
            if (user.id != currentUser.uid) {
                userArr.push(user);
            }
        });
        await Promise.all(promises);
        return userArr;
    } catch (err) {
        throw err;
    }
};

export const getName = async (group) => {
    if (group.data().name)
        return group.data().name;
    else {
        let users = await getUsersExceptCurrent(group);
        return users.map(user => user.data().displayName).join(', ');
    }
};
export const getImage = async (group) => {
    let photoURL;
    if (group.data().photoURL)
        photoURL = group.data().photoURL;
    else {
        let users = await getUsersExceptCurrent(group);
        photoURL = users[0].data().photoURL;
    }
    return photoURL;
};