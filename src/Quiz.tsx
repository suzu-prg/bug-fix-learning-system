/*
  2問目のフローチャート画像を表示する
  最初のページに戻る時にリロードしないと表示されない件を調査する
*/

import React, { Component, useState } from "react";
import {
  useParams,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { firebaseApp, firestore } from "./firebaseApp";
import firebase from "firebase";
import algorithmImage1 from "./img/algorithm1.jpg";
import algorithmImage2 from "./img/algorithm2.jpg";

const algorithmImages = [, algorithmImage1, algorithmImage2];

const algorithmName: string[] = [
  "",
  "エラトステネスのふるい",
  "ハノイの塔",
  "挿入ソート",
];

const choice: string[][] = [
  [],
  [
    "",
    "2から調べたい数までの整数を並べ，生き残った数のうち一番小さいものを素数として，その倍数をふるい落としていくアルゴリズム．",
    "2から調べたい数までの整数を並べ，生き残った数のうち一番大きいものを素数として，その約数をふるい落としていくアルゴリズム．",
    "それぞれの数字kに対して2以上sqrt(k)以下の範囲で約数が存在するか逐一判定するアルゴリズム．",
    "aとpが互いに素な自然数の時 a^(p-1) ≡ 1 (mod p) が成り立つことを用いて素数を判定するアルゴリズム．",
  ],
  [
    "",
    "上からn-1段目までを右に移動させ，残ったn段目を左に移動させ，先ほど移動させたn-1段目までを右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
    "一番上のn段目を右に移動させ，残ったn-1段を左に移動させ，先ほど移動させたn段目を右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
    "上からn-1段目までを右に移動させ，残ったn段目を右に移動させ，先ほど移動させたn-1段目までを右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
    "一番上のn段目を右に移動させ，残ったn-1段を右に移動させ，先ほど移動させたn段目を右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
  ],
  [
    "",
    "隣りあう要素同士の大小を比較し，順序が逆なら入れ替えを行うことによってソートをするアルゴリズム．",
    "位取り記数法で表現可能な対象に対して，下の桁から順番にソートしてゆき，全体を順序通りに並べるアルゴリズム．",
    "既に整列されている複数の数列を，小さいものから順に並べながらマージすることで整列させていくアルゴリズム．",
    "整列してある数列に対して，適切な場所に要素を挿入することを繰り返すことでソートをするアルゴリズム．",
  ],
];

const statement3: string[] = [
  ``,
  `#define MAX 100000
int p[MAX];

void Eratosthenes(){
    for(int i = 0; i < MAX; i++){
        p[i] = 1;
    }
    p[0] = 0; p[1] = 0;
    for(int i = 2; i < sqrt(MAX); i++){
        if(p[i]){
            for(int j = 0; i * (j + 2) < MAX; j++){
                p[i * (j + 2)] = 0;
            }
        }
    }
}

トレース問題：
p[91]の値が0に書き換えられる時の，for(int i = 2; i < sqrt(MAX); i++){ ループにおけるiの値は？`,
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
答え方は，int N が 1 で int d が 2 の時は 1 2 のようにスペース区切りとすること`,
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
];
// replaced "\n" with "\\n"

const answer1: number[] = [0, 1, 1, 4];

const answer2: string[] = [
  "",
  "p[i * (j + 2)] = 0;",
  "hanoi(N-1, -d)",
  "data[j] = tmp",
];

const answer3: string[] = ["", "7", "1 1", "0 2 4 5 6 8 1 9 7 3"];
interface Params {
  quizId?: string;
}
export const Quiz: React.FC = () => {
  const { quizId } = useParams<Params>();
  const quizIndex = Number(quizId) || 0;
  const [start, setStart] = useState<number>(performance.now());
  const [time1, setTime1] = useState<number>(0);
  const [time2, setTime2] = useState<number>(0);
  const [time3, setTime3] = useState<number>(0);
  const [value1, setValue1] = useState<number>(0);
  const [value2, setValue2] = useState<string>("");
  const [value3, setValue3] = useState<string>("");
  const [message1, setMessage1] = useState<string>("");
  const [message2, setMessage2] = useState<string>("");
  const [message3, setMessage3] = useState<string>("");

  const handleInput2 = (event: any): void => {
    const value = event.target.value;
    setValue2(value);
  };
  const handleInput3 = (event: any): void => {
    const value = event.target.value;
    setValue3(value);
  };
  const send1 = (): void => {
    setTime1(performance.now());
    setMessage1(value1 == answer1[quizIndex] ? "correct" : "wrong");
  };
  const send2 = (): void => {
    setTime2(performance.now());
    setMessage2(
      value2.replace(/\s|\r?\n/g, "") ==
        answer2[quizIndex].replace(/\s|\r?\n/g, "")
        ? "correct"
        : "wrong"
    );
  };
  const send3 = (): void => {
    setTime3(performance.now());
    setMessage3(
      value3.replace(/\s|\r?\n/g, "") ==
        answer3[quizIndex].replace(/\s|\r?\n/g, "")
        ? "correct"
        : "wrong"
    );
    // time3, message3 反映前にfirestore.collectionが呼ばれてしまう
    firestore.collection("quiz" + quizIndex).add({
      uid: firebase.auth().currentUser?.uid,
      value1: value1,
      value2: value2,
      value3: value3,
      message1: message1,
      message2: message2,
      message3:
        value3.replace(/\s|\r?\n/g, "") ==
        answer3[quizIndex].replace(/\s|\r?\n/g, "")
          ? "correct!"
          : "wrong",
      time1: (time1 - start) / 1000,
      time2: (time2 - time1) / 1000,
      time3: (performance.now() - time2) / 1000,
    });
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/quiz/:quizId/1">
            <div>
              {/* this is a quiz {quizIndex} page! */}
              以下の4つの文章の中から，{algorithmName[quizIndex]}
              について正しい内容を述べている文章を1つ選んでください
              <div>
                <input
                  type="radio"
                  name="test"
                  value="1"
                  onChange={() => setValue1(1)}
                />
                　{choice[quizIndex][1]} <br />
                <input
                  type="radio"
                  name="test"
                  value="2"
                  onChange={() => setValue1(2)}
                />
                　{choice[quizIndex][2]} <br />
                <input
                  type="radio"
                  name="test"
                  value="3"
                  onChange={() => setValue1(3)}
                />
                　{choice[quizIndex][3]} <br />
                <input
                  type="radio"
                  name="test"
                  value="4"
                  onChange={() => setValue1(4)}
                />
                　{choice[quizIndex][4]} <br />
                <div> {message1} </div>
                {/* <div>{Math.floor(time1 / 1000)} sec</div> */}
                <Link to={"/quiz/" + quizIndex + "/2"}>
                  <button onClick={send1}>SEND</button>
                </Link>
                {/* <li>
                                    <Link to={"/quiz/" + quizIndex + "/2"}>next</Link>
                                </li> */}
              </div>
            </div>
          </Route>
          <Route path="/quiz/:quizId/2">
            <div>
              [ここにフローチャートの画像] <br />
              <img src={algorithmImages[quizIndex]} />
              上記のフローチャートの空欄に当てはまるコードを答えてください．（セミコロンは不要です）{" "}
              <br />
              <textarea
                value={value2}
                onChange={handleInput2}
                style={{
                  resize: "none",
                  width: 100,
                  height: 15,
                }}
              />
              <div> {message2} </div>
              {/* <div>{Math.floor(time2 / 1000)} sec</div> */}
              <Link to={"/quiz/" + quizIndex + "/3"}>
                <button onClick={send2}>SEND</button>
              </Link>
              {/* <li>
                                <Link to={"/quiz/" + quizIndex + "/3"}>next</Link>
                            </li> */}
            </div>
          </Route>
          <Route path="/quiz/:quizId/3">
            <div>
              <pre>
                <code>{statement3[quizIndex]}</code>
              </pre>
              <textarea
                value={value3}
                onChange={handleInput3}
                style={{
                  resize: "none",
                  width: 100,
                  height: 15,
                }}
              />
              <div> {message3} </div>
              {/* <div>{Math.floor(time3 / 1000)} sec</div> */}
              <Link to="/">
                <button onClick={send3}>SEND</button>
              </Link>
              {/* <li>
                                <Link to="/">Return to the top page</Link>
                            </li> */}
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
