// epics
import {combineEpics} from "redux-observable";
import {userListEpics} from "./userList";


export const epics = combineEpics(
    userListEpics
);