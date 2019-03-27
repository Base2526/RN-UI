import {
    GROUP_FETCHED,
    GROUP_FETCHING,
    GROUP_APPEND,
    GROUP_ERROR,
    GROUP_PREPEND,
    GROUP_LAST_MESSAGE
} from '../actions/const';

const initialState = {loading: false, items: [], error: null, lastMessages: {}};

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

function reducer(state = initialState, action) {
    const nextState = Object.assign({}, state);

    switch (action.type) {
        case GROUP_FETCHING: {
            return {...nextState, loading: true, error: null};
        }
        case GROUP_FETCHED: {
            return {...nextState, loading: false, items: action.items};
        }
        case GROUP_APPEND: {
            let items = nextState.items || [];
            action.items.map(item => {
                let index = getIndex(item, items);
                if (index >= 0) {
                    items[index] = item;
                } else {
                    items.push(item);
                }
            });
            return {...nextState, loading: false, items: [...items]};
        }
        case GROUP_PREPEND: {
            let items = nextState.items || [];
            action.items.map(item => {
                let index = getIndex(item, items);
                if (index >= 0) {
                    items[index] = item;
                } else {
                    items.prepend(item);
                }
            });
            return {...nextState, loading: false, items};
        }
        case GROUP_LAST_MESSAGE: {
            let lastMessages = nextState.lastMessages;
            lastMessages[action.group] = action.message;
            return {...nextState, lastMessages}
        }
        case GROUP_ERROR: {
            return {...nextState, loading: false, error: action.error};
        }

        default: {
            /* Return original state if no actions were consumed. */
            return state;
        }
    }
}

module.exports = reducer;
