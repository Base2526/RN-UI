String.generateID = function (length = 10) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Array.prototype.removeDoc = function (doc) {
    let arr = this, index;
    arr.map((item, i) => {
        if (item.id == doc.id)
            index = i;
    });

    if (index)
        arr.splice(index, 1);

    return arr;
};

Date.getCurrentTime = function () {
    return new Date();
};