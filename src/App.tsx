import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import { Problem } from './Problem';

export const App: React.FC = () => {
    return (
        <Router>
            <div>
                <head>
                    <title>bug-fix-learning-system</title>
                </head>
                <Switch>
                    <Route path="/problem/:problemId">
                        <Problem />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
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

function About() {
    const { aboutId } = useParams();
    return <h2>About: {aboutId}</h2>;
}

function Users() {
    return <h2>Users</h2>;
}
