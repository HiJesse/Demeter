import {LOGIN} from "../constants/action_type";
const initialLoginState = {
    status: 1,
    msg: 'Welcome to Demeter'
};

function login(state = initialLoginState, action) {
    state = {
        status: 1,
        msg: 'clicked '
    };
    return state;
}

export function user(state = initialLoginState, action) {
    let newState = state;
    switch (action.type) {
        case LOGIN:
            newState = login(state, action);
            break;
    }
    return newState;
}