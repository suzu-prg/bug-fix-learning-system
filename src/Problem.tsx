import React, { Component, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { firebaseApp, firestore } from "./firebaseApp";
import firebase from "firebase";

const initialMutant: string[] = [
  "",
  `#define MAX 100000
int p[MAX];

void Eratosthenes(){
    for(int i = 0; i < MAX; i++){
        p[i] = 1;
    }
    p[0] = 0; p[1] = 0;
    for(int i = 2; i < sqrt(MAX); i++){
        if(!p[i]){
            for(int j = 0; i * (j + 1) < MAX; j++){
                p[i * (j + 2)] = 0;
            }
        }
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
}`,
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
];
// replaced "\n" with "\\n"

const initialAnswer: string[] = [
  "",
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
}`,
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
];
// replaced "\n" with "\\n"

interface Params {
  problemId?: string;
}

export const Problem: React.FC = () => {
  const { problemId } = useParams<Params>();
  const problemIndex = Number(problemId) || 0;

  const [start, setStart] = useState<number>(performance.now());
  const [time, setTime] = useState<number>(0);
  const [value, setValue] = useState<string>(initialMutant[problemIndex]);
  const [message, setMessage] = useState<string>("");
  const [mutant, setMutant] = useState<string>(initialMutant[problemIndex]);
  const [answer, setAnswer] = useState<string>(initialAnswer[problemIndex]);

  const handleInput = (event: any): void => {
    const value = event.target.value;
    setValue(value);
  };
  const reset = (): void => {
    setValue(mutant);
  };
  const send = (): void => {
    setMessage(
      value.replace(/\s|\r?\n/g, "") == answer.replace(/\s|\r?\n/g, "")
        ? "correct"
        : "wrong"
    );
  };
  const stop = (): void => {
    setTime(performance.now());
    // setTimeしてからtimeに値が格納されるまでにタイムラグあり
    firestore.collection("problem" + problemIndex).add({
      uid: firebase.auth().currentUser?.uid,
      bugFix: true,
      message: message,
      time: (performance.now() - start) / 1000,
    });
  };

  return (
    <div>
      <div>
        配布済みのアルゴリズムに関する解説pdfと下に表示されているコードについて，これらをじっくり読んでください．{" "}
        <br />
        （コンパイルして実行はしないでください）
        <br />
        下に表示されているコードには1~3個のバグが含まれていますので，これを修正してください．
        <br />
        バグの内容については，変数の追加や行の追加等は行わなくて済むものになっています．{" "}
        <br />．
      </div>
      <div>
        <textarea
          value={value}
          onChange={handleInput}
          style={{
            resize: "none",
            width: 300,
            height: 300,
          }}
        />
      </div>
      <button onClick={reset}>RESET</button>
      <button onClick={send}>SEND</button>
      {/* <button onClick={stop}>TIMER STOP</button> */}
      <div>{message}</div>
      <Link to={"/quiz/" + problemIndex + "/1"}>
        <button onClick={stop}>FINISH</button>
      </Link>
      {/* <div>{Math.floor(time / 1000)} sec</div> */}
      {/* <div>
                <Link to={"/quiz/" + problemIndex + "/1"}>Proceed to a quiz page</Link>
            </div>
            <div>
                <Link to="/">Return to the top page</Link>
            </div> */}
    </div>
  );
};
