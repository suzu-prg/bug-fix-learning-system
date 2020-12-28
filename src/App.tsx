/*
    firebase.auth().currentUser.uid みたいなので現在のユーザー名を取得できそう
*/

import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import { Problem } from './Problem';
import { Quiz } from './Quiz';
import { Read } from './Read';
import firebase from 'firebase';
import { SignInScreen } from './SignInScreen';
import {useCollectionData} from "react-firebase-hooks/firestore";
import {firebaseApp, firestore} from "./firebaseApp";

export const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [myAccount, setMyAccount] = useState<firebase.User>();

    // const [tests, testsLoading, testsError] = useCollectionData(firestore.collection('tests'));
    // console.log(tests, testsLoading, testsError);

    // firestore.collection('tests').add({
    //     createAt: firebase.firestore.FieldValue.serverTimestamp()
    // });

    // firestore.collection('tests').doc('sub').set({
    //     name: "suzu"
    // });

    // firestore.collection('tests').doc('sub').set({
    //     name2: "suzu2"
    // }, {merge: true});

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setLoading(false);
            if (!user) return;
            setMyAccount(user);
        });
    });

    const logout = (): void => {
        firebaseApp.auth().signOut();
        setMyAccount(undefined);
    }

    return (
        <div>
            {loading ? (
                <p>
                    loading...
                </p>
            ) : !myAccount ? (
                <div>
                    <SignInScreen />
                </div>
            ) :
                <Router>
                    <div>
                        <Switch>
                            <Route path="/quiz/:quizId">
                                <Quiz />
                            </Route>
                            <Route path="/problem/:problemId">
                                <Problem />
                            </Route>
                            <Route path="/read/:readId">
                                <Read />
                            </Route>
                            <Route path="/">
                                <Home />
                                <button onClick={() => logout()}>Logout</button>
                            </Route>
                        </Switch>
                    </div>
                </Router>
            }
        </div>
    );
}

function Home() {
    return (
        <div>
            <h2>Select a problem</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="/problem/1">Problem 1</Link>
                    </li>
                    <li>
                        <Link to="/read/1">Read 1</Link>
                    </li>
                    <li>
                        <Link to="/problem/2">Problem 2</Link>
                    </li>
                    <li>
                        <Link to="/read/2">Read 2</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
