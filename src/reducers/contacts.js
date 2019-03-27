import {
    CONTACT_FETCHED,
    CONTACT_FETCHING,
    CONTACT_APPEND,
    CONTACT_ERROR,
    CONTACT_PREPEND,
    CONTACT_POP
} from '../actions/const';

const initialState = {loading: false, items: [], error: null};

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
        case CONTACT_FETCHING: {
            return {...nextState, loading: true, error: null};
        }
        case CONTACT_FETCHED: {
            return {...nextState, loading: false, items: action.items};
        }
        case CONTACT_APPEND: {
            let items = nextState.items || [];
            action.items.map(item => {
                let index = getIndex(item, items);
                if (index >= 0) {
                    items[index] = item;
                } else {
                    items.push(item);
                }
            });
            return {...nextState, loading: false, items};
        }
        case CONTACT_POP: {
            let items = nextState.items || [];
            action.items.map(item => {
                let index = getIndex(item, items);
                if (index >= 0) {
                    items.splice(index, 1);
                }
            });
            return {...nextState, loading: false, items: [...items]};
        }
        case CONTACT_PREPEND: {
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
        case CONTACT_ERROR: {
            return {...nextState, loading: false, error: action.error};
        }

        default: {
            /* Return original state if no actions were consumed. */
            return state;
        }
    }
}

module.exports = reducer;
