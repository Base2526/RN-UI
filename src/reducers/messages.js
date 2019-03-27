import {
    MESSAGE_FETCHING,
    MESSAGE_FETCHED,
    MESSAGE_FETCHED_RESET,
    MESSAGE_ERROR,
    MESSAGE_APPEND,
    MESSAGE_PREPEND
} from '../actions/const';

const initialState = {loading: false, items: {}, error: null};

const getIndex = (item, items) => {
    let index = -1;
    for (let x = 0; x < items.length; x++) {
        let data = items[x];
        if (item && data && ((item._id || item.id) === (data._id || data.id))) {
            index = x;
            break;
        }
    }
    return index;
};

const parseNeededData = (oldItem, newItem) => {
    let data;
    if (oldItem.image) {
        data = {
            ...oldItem
        };
    } else {
        data = newItem;
    }
    return data;
};

function reducer(state = initialState, action) {
    const nextState = Object.assign({}, state);

    switch (action.type) {
        case MESSAGE_FETCHING: {
            return {...nextState, loading: true, error: null};
        }
        case MESSAGE_FETCHED: {
            let items = nextState.items;
            items[action.group.id] = action.items;
            return {...nextState, loading: false, items};
        }
        case MESSAGE_APPEND: {
            let items = nextState.items || {};
            let itemArr = items[action.group.id] || [];
            (action.items || []).map(itemArrItem => {
                let index = getIndex(itemArrItem, itemArr);
                if (index >= 0) {
                    itemArr[index] = parseNeededData(itemArr[index], itemArrItem);
                } else {
                    itemArr.push(itemArrItem);
                }
            });
            items[action.group.id] = itemArr;
            return {...nextState, loading: false, items};
        }
        case MESSAGE_PREPEND: {
            let items = nextState.items || {};
            let itemArr = items[action.group.id]||[];
            (action.items || []).reverse().map(item => {
                let index = getIndex(item, itemArr);
                if (index >= 0) {
                    itemArr[index] = parseNeededData(itemArr[index], item);
                } else {
                    itemArr.unshift(item);
                }
            });
            items[action.group.id] = itemArr;
            return {...nextState, loading: false, items};
        }
        case MESSAGE_FETCHED_RESET: {
            return {...nextState, loading: false, items: action.items};
        }
        case MESSAGE_ERROR: {
            return {...nextState, loading: false, error: action.error};
        }
        default: {
            return state;
        }
    }
}

module.exports = reducer;