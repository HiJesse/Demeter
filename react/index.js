import React from "react";
import ReactDOM from "react-dom";
import 'rxjs';
import {Provider} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import configureStore from "./store/configStore";
import LoginPage from "./containers/LoginPage";
import ModifyPasswordPage from "./containers/ModifyPasswordPage";
import {ROUTER_HOME, ROUTER_MODIFY_PASSWORD, ROUTER_LOGIN} from "./constants/routerConstant";
import HomePage from "./containers/HomePage";


const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path={ROUTER_HOME} component={HomePage}/>
                <Route path={ROUTER_LOGIN} component={LoginPage}/>
                <Route path={ROUTER_MODIFY_PASSWORD} component={ModifyPasswordPage}/>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);