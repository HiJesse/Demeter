import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers/Reducers";
import {createEpicMiddleware} from "redux-observable";
import {epics} from "../epics/Epics";

const epicMiddleware = createEpicMiddleware(epics);

export default function configureStore() {
    return createStore(
        reducers,
        applyMiddleware(epicMiddleware)
    );
}