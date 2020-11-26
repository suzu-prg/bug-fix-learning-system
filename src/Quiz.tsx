import React, { Component, useState } from 'react';
import {
    useParams,
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";

const choice: string[][] = [
    [],
    ['',
        '隣りあう要素同士の大小を比較し，順序が逆なら入れ替えを行うことによってソートをするアルゴリズム．',
        '位取り記数法で表現可能な対象に対して，下の桁から順番にソートしてゆき，全体を順序通りに並べるアルゴリズム．',
        '既に整列されている複数の数列を，小さいものから順に並べながらマージすることで整列させていくアルゴリズム．',
        '整列してある数列に対して，適切な場所に要素を挿入することを繰り返すことでソートをするアルゴリズム．'
    ],
    ['',
        '上からn-1段目までを右に移動させ，残ったn段目を左に移動させ，先ほど移動させたn-1段目までを右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．',
        '一番上のn段目を右に移動させ，残ったn-1段を左に移動させ，先ほど移動させたn段目を右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．',
        '上からn-1段目までを右に移動させ，残ったn段目を右に移動させ，先ほど移動させたn-1段目までを右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．',
        '一番上のn段目を右に移動させ，残ったn-1段を右に移動させ，先ほど移動させたn段目を右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．'
    ]
];

const statement3: string[] = [
    ``,
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
}
トレース問題：
2 0 8 4 5 6 1 9 7 3
について，5回目のforループ終了時の様子を答えよ`,
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
}
N = 3 の時，6回目の hanoi() の呼び出しの時の引数を答えよ（最初の hanoi(3, 1) の呼び出しを1回目とする）
答え方は，int N が 1 で int d が 2 の時は 1 2 のようにスペース区切りとすること`
]
// replaced "\n" with "\\n"

const answer1: number[] = [0, 4, 1]

const answer2: string[] = [
    '',
    'data[j] = tmp',
    'hanoi(N-1, -d)'
]

const answer3: string[] = [
    '',
    '0 2 4 5 6 8 1 9 7 3',
    '1 1'
]

export const Quiz: React.FC = () => {
    const { quizId } = useParams();
    const [start, setStart] = useState<number>(performance.now());
    const [time, setTime] = useState<number>(0);
    const [value1, setValue1] = useState<number>(0);
    const [value2, setValue2] = useState<string>('');
    const [value3, setValue3] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    // const history = useHistory();

    const handleInput2 = (event: any): void => {
        const value = event.target.value;
        setValue2(value);
    };
    const handleInput3 = (event: any): void => {
        const value = event.target.value;
        setValue3(value);
    };
    const send1 = (): void => {
        setTime(performance.now() - start);
        setMessage(value1 == answer1[quizId] ? "correct!" : "wrong")
        // history.push("/quiz/" + quizId + "/2");
    };
    const send2 = (): void => {
        setTime(performance.now() - start);
        setMessage(value2.replace(/\s|\r?\n/g, "") == answer2[quizId].replace(/\s|\r?\n/g, "") ? "correct!" : "wrong")
        // history.push("/quiz/" + quizId + "/3");
    };
    const send3 = (): void => {
        setTime(performance.now() - start);
        setMessage(value3.replace(/\s|\r?\n/g, "") == answer3[quizId].replace(/\s|\r?\n/g, "") ? "correct!" : "wrong")
        // history.push('/');
    };

    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/quiz/:quizId/1">
                        <div>
                            this is a quiz {quizId} page!
                            <p>
                                <input type="radio" name="test" value="1" onChange={() => setValue1(1)} />　{choice[quizId][1]} <br />
                                <input type="radio" name="test" value="2" onChange={() => setValue1(2)} />　{choice[quizId][2]} <br />
                                <input type="radio" name="test" value="3" onChange={() => setValue1(3)} />　{choice[quizId][3]} <br />
                                <input type="radio" name="test" value="4" onChange={() => setValue1(4)} />　{choice[quizId][4]} <br />
                                <div> {message} </div>
                                <div>{Math.floor(time / 1000)} sec</div>
                                <button onClick={send1}>SEND</button>
                                <li>
                                    <Link to={"/quiz/" + quizId + "/2"}>next</Link>
                                </li>
                            </p>
                        </div>
                    </Route>
                    <Route path="/quiz/:quizId/2">
                        <div>
                            [ここにフローチャートの画像] <br />
                            <textarea value={value2} onChange={handleInput2} style={{
                                resize: "none",
                                width: 100,
                                height: 15
                            }} />
                            <div> {message} </div>
                            <div>{Math.floor(time / 1000)} sec</div>
                            <button onClick={send2}>SEND</button>
                            <li>
                                <Link to={"/quiz/" + quizId + "/3"}>next</Link>
                            </li>
                        </div>
                    </Route>
                    <Route path="/quiz/:quizId/3">
                        <div>
                            {statement3[quizId]} <br />
                            <textarea value={value3} onChange={handleInput3} style={{
                                resize: "none",
                                width: 100,
                                height: 15
                            }} />
                            <div> {message} </div>
                            <div>{Math.floor(time / 1000)} sec</div>
                            <button onClick={send3}>SEND</button>
                            <li>
                                <Link to="/">Return to the top page</Link>
                            </li>
                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};
