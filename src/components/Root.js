import * as React from 'react';
import { Component } from 'react';
import Container from './StyleComponents/Airticle';
import Header from './StyleComponents/Header';
import TextFieldWrapper from './StyleComponents/TextField';
// import {
//     Link,
//     Icon,
//     Label,
// } from './StyleComponents/Notice';
import Notice from './StyleComponents/Notice';

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            focus: false;
        };
        this._handleFocus = this._handleFocus.bind(this);
    }
    componentWillMount() {
        this.setState({ index: 1 });
    }

    componentDidMount() {
        console.log('pregserss', process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') console.log('prod');
        else console.log('dev');
    }

    _handleFocus() {
        this.setState({ focus: !this.state.focus });
    }

    render() {
        return (
            <Container>
                <Header>Hello Fusebox!!</Header>
                <TextFieldWrapper.TextField
                  padding={30}
                  onClick={this._handleFocus}
                  innerRef={ref => { this.textField = ref; }}
                  onMouseEnter={() => this.textField.focus()}
                />
                <div style={{marginBottom: '5px' }}>
                    <TextFieldWrapper.UnderLine />
                </div>
                <Notice.div>
                    <Notice.Icon viewBox="0 0 20 20">
                        <path d="M10 15h8c1 0 2-1 2-2V3c0-1-1-2-2-2H2C1 1 0 2 0 3v10c0 1 1 2 2 2h4v4l4-4zM5 7h2v2H5V7zm4 0h2v2H9V7zm4 0h2v2h-2V7z" />
                    </Notice.Icon>
                    <Notice.Label>Hovering my parent changes my style!</Notice.Label>
                </Notice.div>
            </Container>
        );
    }
}

export default Root;
