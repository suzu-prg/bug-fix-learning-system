import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import { Problem } from './Problem';
import firebase from 'firebase';
import { SignInScreen } from './SignInScreen';
import { render } from 'react-dom';

export const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [myAccount, setMyAccount] = useState<firebase.User>();


    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setLoading(false);
            if (!user) return;
            setMyAccount(user);
        });
    });


    const logout = (): void => {
        firebase.auth().signOut();
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
                            <Route path="/problem/:problemId">
                                <Problem />
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
            <h2>Select a problrem</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="/problem/1">Problem 1</Link>
                    </li>
                    <li>
                        <Link to="/problem/2">Problem 2</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}