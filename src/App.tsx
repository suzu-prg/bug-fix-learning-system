import React, { Component, useState } from 'react';

class Name extends Component {
    render () {
        const name = this.props.name;

        return (
            name
        );
    }
}

const initialMutant = `for (i = 1; i < n; i++) {
    tmp = data[i];
    if (data[i] > tmp) {
        j = i;
        do {
            data[j] = data[j - 1];
            j++;
        } while (j > 0 && data[j] > tmp);
        data[j] = tmp;
    }
}`;
const initialAnswer = `for (i = 1; i < n; i++) {
    tmp = data[i];
    if (data[i - 1] > tmp) {
        j = i;
        do {
            data[j] = data[j - 1];
            j--;
        } while (j > 0 && data[j - 1] > tmp);
        data[j] = tmp;
    }
}`;

export const App: React.FC = () => {
    const [start, setStart] = useState<number>(performance.now());
    const [time, setTime] = useState<number>(0);
    const [value, setValue] = useState<string>(initialMutant);
    const [message, setMessage] = useState<string>('');
    const [mutant, setMutant] = useState<string>(initialMutant);
    const [answer, setAnswer] = useState<string>(initialAnswer);
    
    const handleInput = (event: any): void => {
        const value = event.target.value;
        setValue(value);
    };
    const reset = (): void => {
        setValue(mutant);
    };
    const send = (): void => {
        setMessage(value.replace(/\s|\r?\n/g, "") == answer.replace(/\s|\r?\n/g, "") ? "correct!" : "wrong")
    };
    const stop = (): void => {
        setTime(performance.now() - start);
    };
    
    return (
        <div>
            <head>
                <title>bug-fix-learning-system</title>
            </head>
            <div>
                <textarea type="text" value={value} onChange={handleInput} style={{
                    resize: "none",
                    width: 300,
                    height: 300
                }} multiline />
            </div>
            <button onClick={reset}>RESET</button>
            <button onClick={send}>SEND</button>
            <button onClick={stop}>TIMER STOP</button>
            <div>{message}</div>
            <div>{Math.floor(time / 1000)} sec</div>
        </div>
    );
};
