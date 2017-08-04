// epics
import { combineEpics } from 'redux-observable';
import {fetchUserListEpic} from "./userList";


export const epics = combineEpics(
    fetchUserListEpic,
);