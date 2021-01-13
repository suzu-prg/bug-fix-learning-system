import React, { useState } from "react";
import { Route, useHistory, useParams } from "react-router-dom";
import { firestore } from "../firebaseApp";
import firebase from "firebase";
import algorithmImage1 from "../img/algorithm1.jpg";
import algorithmImage2 from "../img/algorithm2.jpg";
import { useForm } from "react-hook-form";

const algorithmImages = [, algorithmImage1, algorithmImage2];

const algorithmName: string[] = ["", "エラトステネスのふるい", "ハノイの塔"];

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
    "一番上の1段目を右に移動させ，残ったn-1段を左に移動させ，先ほど移動させた1段目を右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
    "上からn-1段目までを右に移動させ，残ったn段目を右に移動させ，先ほど移動させたn-1段目までを右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
    "一番上の1段目を右に移動させ，残ったn-1段を右に移動させ，先ほど移動させた1段目を右に移動させる，という処理を左右を反転させながら再帰的に行うアルゴリズム．",
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
];
// replaced "\n" with "\\n"

const answer1: number[] = [0, 1, 1, 4];

const answer2: string[] = ["", "p[i * (j + 2)] = 0", "hanoi(N-1, -d)"];

const answer3: string[] = ["", "7", "1 1"];

interface Params {
  quizId?: string;
}
export const QuizPage: React.FC = () => {
  const { quizId } = useParams<Params>();
  const quizIndex = Number(quizId) || 0;
  const [start, setStart] = useState(performance.now());
  const [time1, setTime1] = useState(0);
  const [time2, setTime2] = useState(0);
  const [time3, setTime3] = useState(0);
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  console.log(errors);

  const send1 = (value: number): void => {
    setTime1(performance.now());
    setValue1(value);
    setMessage1(value === answer1[quizIndex] ? "correct" : "wrong");
  };
  const send2 = (value: string): void => {
    setTime2(performance.now());
    setValue2(value);
    setMessage2(
      value.replace(/\s|\r?\n/g, "") ===
        answer2[quizIndex].replace(/\s|\r?\n/g, "")
        ? "correct"
        : "wrong"
    );
  };
  const send3 = (value: string): void => {
    setTime3(performance.now());
    setValue3(value);
    setMessage3(
      value.replace(/\s|\r?\n/g, "") ===
        answer3[quizIndex].replace(/\s|\r?\n/g, "")
        ? "correct"
        : "wrong"
    );
    // time3, message3 反映前にfirestore.collectionが呼ばれてしまう
    firestore.collection("quiz" + quizIndex).add({
      uid: firebase.auth().currentUser?.uid,
      value1: value1,
      value2: value2,
      value3: value,
      message1: message1,
      message2: message2,
      message3:
        value.replace(/\s|\r?\n/g, "") ===
        answer3[quizIndex].replace(/\s|\r?\n/g, "")
          ? "correct"
          : "wrong",
      time1: (time1 - start) / 1000,
      time2: (time2 - time1) / 1000,
      time3: (performance.now() - time2) / 1000,
    });
  };

  return (
    <>
      <Route path="/quiz/:quizId/1">
        <div>
          以下の4つの文章の中から，{algorithmName[quizIndex]}
          について正しい内容を述べている文章を1つ選んでください
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            send1(Number(data.answer));
            history.push(`/quiz/${quizIndex}/2`);
          })}
        >
          <input
            type="radio"
            name="answer"
            value="1"
            ref={register({ required: true })}
          />
          {choice[quizIndex][1]} <br />
          <input
            type="radio"
            name="answer"
            value="2"
            ref={register({ required: true })}
          />
          {choice[quizIndex][2]} <br />
          <input
            type="radio"
            name="answer"
            value="3"
            ref={register({ required: true })}
          />
          {choice[quizIndex][3]} <br />
          <input
            type="radio"
            name="answer"
            value="4"
            ref={register({ required: true })}
          />
          {choice[quizIndex][4]} <br />
          {/* <div> {message1} </div> */}
          {errors.answer && (
            <div style={{ color: "red" }}>* 選択肢を一つ選んでください。</div>
          )}
          <button type="submit">SEND</button>
        </form>
      </Route>
      <Route path="/quiz/:quizId/2">
        <div>
          <img src={algorithmImages[quizIndex]} />
          <br />
          上記のフローチャートの空欄に当てはまるコードを答えてください．（セミコロンは不要です）{" "}
          <br />
          <form
            onSubmit={handleSubmit((data) => {
              send2(data.answer);
              history.push(`/quiz/${quizIndex}/3`);
            })}
          >
            <input
              name="answer"
              type="text"
              ref={register({ required: true })}
            />
            {/* <div> {message2} </div> */}
            {errors.answer && (
              <div style={{ color: "red" }}>* 解答を入力してください。</div>
            )}
            <button type="submit">SEND</button>
          </form>
        </div>
      </Route>
      <Route path="/quiz/:quizId/3">
        <div>
          <pre>
            <code>{statement3[quizIndex]}</code>
          </pre>
          <form
            onSubmit={handleSubmit((data) => {
              send3(data.answer);
              history.push("/");
            })}
          >
            <input
              name="answer"
              type="text"
              ref={register({ required: true })}
            />
            {/* <div> {message3} </div> */}
            {errors.answer && (
              <div style={{ color: "red" }}>* 解答を入力してください。</div>
            )}
            <button type="submit">SEND</button>
          </form>
        </div>
      </Route>
    </>
  );
};
