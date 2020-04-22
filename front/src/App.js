import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
function App() {
  return (
    <Router>
        <Header/>
        <div className={"container"}>
                <Switch>
                <Route exact={true} path='/'  component={Home}/>
                <Route exact={true} path='/home' component={Home}/>
                <Redirect from='*' to='/' />
                </Switch>
            </div>

    </Router>
    
  );
}

export default App;
