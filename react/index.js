import React from "react";
import ReactDOM from "react-dom";
import Login from "./containers/login";
import {Provider} from "react-redux";
import configureStore from "./store/config_store"

let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Login />
    </Provider>,
    document.getElementById('root')
);