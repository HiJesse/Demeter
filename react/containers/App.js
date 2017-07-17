import React from "react";

export default class App extends React.Component {

    render() {
        console.log('jesse', 'app')
        return (
            <div>
                asdfasdf
                {this.props.children}
            </div>
        );
    }
}