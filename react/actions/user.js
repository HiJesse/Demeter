import {LOGIN} from "../constants/action_type";

export const login = () => {

    return {
        type: LOGIN,
        payload: "login action"
    }
};