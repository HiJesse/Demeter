import React from "react";
import {Input} from "antd";

export const TextEditableStatus = {
    SAVE: 'save',
    CANCEL: 'cancel'
};

export const TextEditableMode = {
    INPUT: 'input'
};

// 列表item
export default class TextEditableItemView extends React.Component {

    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({editable: nextProps.editable});
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }

        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === TextEditableStatus.SAVE) {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === TextEditableStatus.CANCEL) {
                this.setState({value: this.cacheValue});
                this.props.onChange(this.cacheValue);
            }
        }

        if (nextProps.value !== this.state.value) {
            this.setState({value: nextProps.value})
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }

    render() {
        const {value, editable} = this.state;
        const mode = this.props.mode;
        let content;


        if (!editable) {
            content = (
                <div>
                    {value || ' '}
                </div>
            )
        } else if (mode === TextEditableMode.INPUT) {
            content = (
                <Input
                    value={value}
                    onChange={e => this.handleChange(e)}
                />
            );
        }

        return (
            <div>
                {content}
            </div>
        )
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({value});
    }
}

TextEditableItemView.PropTypes = {
    value: React.PropTypes.string.isRequired, // 显示value
    editable: React.PropTypes.bool.isRequired, // 是否处于可编辑状态
    status: React.PropTypes.oneOf([
        TextEditableStatus.CANCEL,
        TextEditableStatus.SAVE]).isRequired, // 当前状态
    mode: React.PropTypes.oneOf([
        TextEditableMode.INPUT
    ]), // 模式
    onChange: React.PropTypes.func.isRequired, // 值变化回调
};

TextEditableItemView.defaultProps = {
    mode: TextEditableMode.INPUT
};