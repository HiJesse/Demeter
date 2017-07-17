import {LOGIN} from "../constants/action_type";

export const login = (account, pwd) => {

    console.log('account', account);
    console.log('password', pwd)
    return {
        type: LOGIN,
        account: account,
        pwd: pwd
    }
};