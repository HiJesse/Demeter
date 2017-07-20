import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import configureStore from "./store/config_store";
import LoginPage from "./containers/LoginPage";
import ModifyPassword from "./containers/ModifyPassword";
import {ROUTER_HOME, ROUTER_MODIFY_PASSWORD, ROUTER_ROOT} from "./constants/routerConstant";
import HomePage from "./containers/HomePage";


let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path={ROUTER_ROOT} component={LoginPage}/>
                <Route path={ROUTER_MODIFY_PASSWORD} component={ModifyPassword}/>
                <Route path={ROUTER_HOME} component={HomePage}/>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);