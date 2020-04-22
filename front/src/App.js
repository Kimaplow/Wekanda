import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
import Profile from './components/Profile';
import Play from './components/Play';
import Signin from './components/forms/Signin'
import Signup from './components/forms/Signup'
function App() {
  return (

    <Router>

        <Header/>

        <div id={"main-container"}>
              <Switch>
                <Route exact={true} path='/'  component={Home}/>
                <Route exact={true} path='/home' component={Home}/>
                <Route exact={true} path='/profile/:username' component={Profile}/>
                <Route exact={true} path='/play/:id_quizz' component={Play}/>
                <Route exact={true} path='/signin' component={Signin}/>
                <Route exact={true} path='/signup' component={Signup}/>


                <Redirect from='*' to='/' />
              </Switch>
        </div>
    </Router>
    
  );
}

export default App;
