import React from "react";
import {PROJECT_GITHUB, VIEW_FOOTER} from "../constants/string_constant";

export default class FooterView extends React.Component {

    render() {
        return (
            <div>
                {VIEW_FOOTER}
                <a href={PROJECT_GITHUB}>Jesse</a>
            </div>
        );
    }
}