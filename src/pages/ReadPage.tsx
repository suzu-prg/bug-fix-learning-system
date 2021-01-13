import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { firestore } from "../firebaseApp";
import firebase from "firebase";

const algorithmName: string[] = ["", "エラトステネスのふるい", "ハノイの塔"];

const initialCode: string[] = [
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
  readId?: string;
}

export const ReadPage: React.FC = () => {
  const { readId } = useParams<Params>();
  const readIndex = Number(readId) || 0;

  const [start, setStart] = useState<number>(performance.now());
  const [time, setTime] = useState<number>(0);
  const [value, setValue] = useState<string>(initialCode[readIndex]);
  // const [message, setMessage] = useState<string>('');
  // const [mutant, setMutant] = useState<string>(initialMutant[readIndex]);
  // const [answer, setAnswer] = useState<string>(initialAnswer[readIndex]);

  const handleInput = (event: any): void => {
    const value = event.target.value;
    setValue(value);
  };
  // const reset = (): void => {
  //     setValue(mutant);
  // };
  // const send = (): void => {
  //     setMessage(value.replace(/\s|\r?\n/g, "") == answer.replace(/\s|\r?\n/g, "") ? "correct!" : "wrong");
  // };
  const stop = (): void => {
    setTime(performance.now() - start);
    // setTimeしてからtimeに値が格納されるまでにタイムラグあり
    firestore.collection("problem" + readIndex).add({
      uid: firebase.auth().currentUser?.uid,
      bugFix: false,
      message: "",
      time: (performance.now() - start) / 1000,
    });
    // ここでページ移動したい
  };

  return (
    <div>
      <div>
        <h2>学習パート[コードリーディング]</h2>
        <br />
        ・解説pdfの{algorithmName[readIndex]}
        のページと下に表示されているコードについて，これらをじっくり読んでください．{" "}
        <br />
        ・手元の環境でコンパイルして実行はしないでください
        <br />
        ・学習が終わったら，FINISHボタンを押してください．
        <br />
        ・学習パートを終えるタイミングは自由です． <br />
        <br />
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
      <Link to={"/quiz/" + readIndex + "/1"}>
        <button onClick={stop}>FINISH</button>
      </Link>

      {/* <div>{Math.floor(time / 1000)} sec</div> */}
      {/* <div>
                <Link to={"/quiz/" + readIndex + "/1"}>Proceed to a quiz page</Link>
            </div>
            <div>
                <Link to="/">Return to the top page</Link>
            </div> */}
    </div>
  );
};
