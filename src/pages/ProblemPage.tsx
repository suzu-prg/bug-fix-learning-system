import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { firestore } from "../firebaseApp";
import firebase from "firebase";

const algorithmName: string[] = ["", "エラトステネスのふるい", "ハノイの塔"];

const initialMutant: string[] = [
  "",
  `#define MAX 100000
int p[MAX];

void Eratosthenes(){
    for(int i = 0; i < MAX; i++){
        p[i] = 1;
    }
    p[0] = 0; p[2] = 0;
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
];
// replaced "\n" with "\\n"

interface Params {
  problemId?: string;
}

export const ProblemPage: React.FC = () => {
  const { problemId } = useParams<Params>();
  const problemIndex = Number(problemId) || 0;

  const [start, setStart] = useState<number>(performance.now());
  const [time, setTime] = useState<number>(0);
  const [value, setValue] = useState<string>(initialMutant[problemIndex]);
  const [message, setMessage] = useState<string>("");
  const [mutant, setMutant] = useState<string>(initialMutant[problemIndex]);
  const [answer, setAnswer] = useState<string>(initialAnswer[problemIndex]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

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
    setIsFinished(true);
  };

  return (
    <div>
      <div>
        <h2>学習パート[バグ修正問題]</h2>
        <br />
        ・解説pdfの{algorithmName[problemIndex]}
        のページと下に表示されているコードについて，これらをじっくり読んでください．{" "}
        <br />
        ・下に表示されているコードには
        <strong>1~3個のバグが含まれています．</strong>これを修正してください．
        <br />
        ・ただし，バグの内容については，変数の追加や行の追加等は行わなくて済むものになっています．{" "}
        <br />
        ・手元の環境でコンパイルして実行はしないでください
        <br />
        ・RESETボタンで最初の状態に戻ります
        <br />
        ・SENDボタンでその修正が正しいかどうかが判定されます（correct or wrong）
        <br />
        ・学習が終わったら，FINISHボタンを押してください．押すと，確認問題へ進むリンクが画面の一番下に表示されます．
        <br />
        ・学習パートを終えるタイミングは自由です．（必ずしもバグ修正が終わったタイミングでなくても構いません）
        <br />
        <br />
      </div>
      <div>
        <textarea
          value={value}
          onChange={handleInput}
          style={{
            resize: "none",
            width: 300,
            height: 300,
            float: "left",
          }}
        />
      </div>
      {isFinished && message != "correct" && (
        <div>
          正解のコードはこちらです：
          <pre>
            <code>{initialAnswer[problemIndex]}</code>
          </pre>
        </div>
      )}
      <div style={{ clear: "left" }}>
        <button onClick={reset}>RESET</button>
        <button onClick={send}>SEND</button>
        {/* <button onClick={stop}>TIMER STOP</button> */}
        <div>{message}</div>
        {isFinished || <button onClick={stop}>FINISH</button>}
        <br />
        {isFinished && (
          <Link to={"/quiz/" + problemIndex + "/1"}>確認問題へ進む</Link>
        )}
        {/* <div>{Math.floor(time / 1000)} sec</div> */}
      </div>
    </div>
  );
};
