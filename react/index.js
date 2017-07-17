import React from "react";
import ReactDOM from "react-dom";
import LoginPage from "./containers/LoginPage";
import {Provider} from "react-redux";
import configureStore from "./store/config_store"

let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <LoginPage />
    </Provider>,
    document.getElementById('root')
);