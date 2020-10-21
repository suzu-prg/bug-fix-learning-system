import React, { Component } from 'react';

class Name extends Component {
    render () {
        const name = this.props.name;

        return (
            name
        );
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: '',
            message: '',
            mutant:
`for (i = 1; i < n; i++) {
    tmp = data[i];
    if (data[i] > tmp) {
        j = i;
        do {
            data[j] = data[j - 1];
            j++;
        } while (j > 0 && data[j] > tmp);
        data[j] = tmp;
    }
}`,
            answer:
`for (i = 1; i < n; i++) {
    tmp = data[i];
    if (data[i - 1] > tmp) {
        j = i;
        do {
            data[j] = data[j - 1];
            j--;
        } while (j > 0 && data[j - 1] > tmp);
        data[j] = tmp;
    }
}`
        };
        this.state.value = this.state.mutant;
        this.handleInput = this.handleInput.bind(this);
        this.reset = this.reset.bind(this);
        this.send = this.send.bind(this);
    }

    handleInput(event) {
        let value = event.target.value;
        this.setState({
            value: value
        });
    }

    reset() {
        this.setState({
            value: this.state.mutant
        });
    }


    send() {
        const { value } = this.state;
        this.setState({
            message: value.replace(/\s|\r?\n/g, "") == this.state.answer.replace(/\s|\r?\n/g, "") ? "correct!" : "wrong"
        });
    }

    render() {
        return (
            <div>
                <head>
                    <title>bug-fix-learning-system</title>
                </head>
                <div>
                    <textarea type="text" value={this.state.value} onChange={this.handleInput} style={{
                        resize: "none",
                        width: 300,
                        height: 300
                    }} multiline />
                </div>
                <button onClick={this.reset}>RESET</button>
                <button onClick={this.send}>SEND</button>
                <div>{this.state.message}</div>
            </div>
        );
    }
}