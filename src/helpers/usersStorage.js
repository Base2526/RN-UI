let users = {};

module.exports = async (userDoc) => {
    if (!userDoc)
        return null;
    if (users[userDoc.id]) {
        return users[userDoc.id];
    } else {
        let docData = await userDoc.get();
        users[userDoc.id] = docData;
        return docData;
    }
};