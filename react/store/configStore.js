import {createStore} from "redux";
import reducers from "../reducers/reducers";

export default function configureStore() {
    return createStore(reducers);
}