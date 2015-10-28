import * as React from 'react';
import * as e from '../Enums';
import InvocationModel from '../Invocation';
import {scrollToBottom} from './ViewUtils';
import Prompt from './Prompt';
import BufferComponent from "./BufferComponent";

interface Props {
    invocation: InvocationModel
}

interface State {
    status?: e.Status;
    canBeDecorated?: boolean;
    decorate?: boolean;
}

export default class Invocation extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            status: this.props.invocation.status,
            decorate: false,
            canBeDecorated: false
        };

        this.props.invocation
            .on('data', _ => this.setState({canBeDecorated: this.props.invocation.canBeDecorated()}))
            .on('status', status => this.setState({status: status}));
    }

    componentDidUpdate() {
        if (this.props.invocation.getBuffer().activeBuffer === e.Buffer.Standard) {
            scrollToBottom();
        }
    }

    render() {
        if (this.state.canBeDecorated && this.state.decorate) {
            var buffer = this.props.invocation.decorate();
        } else {
            buffer = React.createElement(BufferComponent, {buffer: this.props.invocation.getBuffer()});
        }

        const classNames = 'invocation ' + this.state.status;

        return React.createElement(
            'div',
            { className: classNames },
            React.createElement(Prompt, { prompt: this.props.invocation.getPrompt(),
                status: this.state.status,
                invocation: this.props.invocation,
                invocationView: this }),
            buffer
        );
    }
}
