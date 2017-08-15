// epics
import {combineEpics} from "redux-observable";
import {userManagerEpics} from "./userManager";
import {userEpics} from "./user";


export const epics = combineEpics(
    userEpics,
    userManagerEpics
);