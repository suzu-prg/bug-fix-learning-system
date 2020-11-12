import React, { Component, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const initialMutant: string[] = ['',
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
`// 呼び出しは hanoi(N, 1);
void shift(int N, int d)
{
  if (d == 1)
    printf(“皿%dを左に動かす.\\n”, N);
  else if (d == -1)
    printf(“皿%dを右に動かす.\\n”, N);
}
void hanoi(int N, int d)
{
　　if (N == 0) return;
　　hanoi(N-1, -d);
　　shift(N-1, d);
　　hanoi(N-1, d);
}`];
// replaced "\n" with "\\n"

const initialAnswer: string[] = ['',
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
}`,
`// 呼び出しは hanoi(N, 1);
void shift(int N, int d)
{
  if (d == 1)
    printf(“皿%dを左に動かす.\\n”, N);
  else if (d == -1)
    printf(“皿%dを右に動かす.\\n”, N);
}
void hanoi(int N, int d)
{
　　if (N == 0) return;
　　hanoi(N-1, -d);
　　shift(N, d);
　　hanoi(N-1, -d);
}`
];
// replaced "\n" with "\\n"

export const Problem: React.FC = () => {
    const { problemId } = useParams();
    const [start, setStart] = useState<number>(performance.now());
    const [time, setTime] = useState<number>(0);
    const [value, setValue] = useState<string>(initialMutant[problemId]);
    const [message, setMessage] = useState<string>('');
    const [mutant, setMutant] = useState<string>(initialMutant[problemId]);
    const [answer, setAnswer] = useState<string>(initialAnswer[problemId]);
    
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
            <div>          
                <Link to="/">Return to the top page</Link>
            </div>
        </div>
    );
};
