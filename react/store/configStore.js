import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers/reducers";
import {createEpicMiddleware} from 'redux-observable';
import {epics} from "../epics/epics";

const epicMiddleware = createEpicMiddleware(epics);

export default function configureStore() {
    return createStore(
        reducers,
        applyMiddleware(epicMiddleware)
    );
}