import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import configureStore from "./store/config_store";
import LoginPage from "./containers/LoginPage";
import ForgetPassword from "./containers/ForgetPassword";


let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path="/" component={LoginPage}/>
                <Route path="/forgetPassword" component={ForgetPassword}/>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);