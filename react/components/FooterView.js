import React from "react";
import {PROJECT_GITHUB, VIEW_FOOTER} from "../constants/StringConstant";
import {Icon} from "antd";

export default class FooterView extends React.Component {

    render() {
        return (
            <div>
                {VIEW_FOOTER}
                <a href={PROJECT_GITHUB}>Jesse</a>
                <Icon type="github" style={{marginLeft: 3}}/>
            </div>
        );
    }
}