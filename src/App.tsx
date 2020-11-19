import React from 'react';
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
    // const state = {
    //     loading: true,
    //     user: null
    // };
    // const componentDidMount = (): void => {
    //     firebase.auth().onAuthStateChanged(user => {
    //         this.setState({
    //             loading: false,
    //             user: user
    //         });
    //     });
    // };

    // const logout = (): void => {
    //     firebase.auth().signOut();
    // }
    // const render = (): void => {
    //     if(this.state.loading) return <div>loading</div>;
return (<div><SignInScreen /></div>
            // <div>
            //     Uername: {this.state.user && this.state.user.displayName}
            //     <br />
            //     {this.state.user ? 
            //     (<button onClick={this.logout}>Logout </button>) :
            //     (<SignInScreen />)
            // }
            // </div>
        );
    // }

    // return (
    //     <Router>
    //         <div>
    //             <Switch>
    //                 <Route path="/problem/:problemId">
    //                     <Problem />
    //                 </Route>
    //                 <Route path="/">
    //                     <Home />
    //                 </Route>
    //             </Switch>
    //         </div>
    //     </Router>
    // )
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