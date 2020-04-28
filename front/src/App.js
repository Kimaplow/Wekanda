import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
import Profile from './components/Profile';
import Play from './components/Play';
import Signin from './components/Signin';
import Signup from './components/Signup';
import EditQuizz from './components/EditQuizz';
import AddQuizz from './components/AddQuizz';
import FilterQuizz from './components/FilterQuizz';


function App() {
  return (

    <Router>

        <Header/>

        <div id={"main-container"}>
              <Switch>
                <Route exact={true} path='/'  component={Home}/>
                <Route exact={true} path='/home' component={Home}/>
                <Route exact={true} path='/profile/:id_user' component={Profile}/>
                <Route exact={true} path='/play/:id_quizz' component={Play}/>
                <Route exact={true} path='/signin' component={Signin}/>
                <Route exact={true} path='/signup' component={Signup}/>
                <Route exact={true} path='/quizz/:id_quizz/edit' component={EditQuizz}/>
                <Route exact={true} path='/user/:id_user/addQuizz' component={AddQuizz}/>
                <Route exact={true} path='/quizzes/:tag' component={FilterQuizz}  />

                <Redirect from='*' to='/' />
              </Switch>
        </div>
    </Router>
    
  );
}

export default App;
