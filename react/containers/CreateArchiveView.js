import React from "react";
import {connect} from "react-redux";

// 归档管理-新建归档
class CreateArchiveView extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <div>{'create archive'}</div>
        );
    }
}

function select(state) {
    const archive = state.archive;
    return {};
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(select, mapDispatchToProps)(CreateArchiveView);