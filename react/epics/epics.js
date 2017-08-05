// epics
import {combineEpics} from "redux-observable";
import {userListEpics} from "./userList";
import {userEpics} from "./user";


export const epics = combineEpics(
    userEpics,
    userListEpics
);