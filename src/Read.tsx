import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { firestore } from "./firebaseApp";
import firebase from "firebase";

const initialCode: string[] = [
  "",
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
  readId?: string;
}

export const Read: React.FC = () => {
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
