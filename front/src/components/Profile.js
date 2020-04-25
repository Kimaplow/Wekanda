import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './css/profile.css';

import QuizzCard from './QuizzCard';

export default function Profile() {
    const { id_user } = useParams();

    const [user, setUser] = useState({});
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [userScores, setUserScores] = useState([]);

<<<<<<< HEAD
    async function fetchUser() {
=======
    console.log(`http://${config.server}/quizzes/fromuser/${id_user}`);


    async function fetchUser(){
>>>>>>> b9ce6c0... WIP Profile
        await axios.get(`http://${config.server}/users/${id_user}`)
            .then((res) => {
                setUser(res.data[0]);
            });
    }

<<<<<<< HEAD
    async function fetchUserQuizzes() {
        await axios.get(`http://${config.server}/quizzes/${id_user}/fromuser/`)
            .then((res) => {
                setUserQuizzes(res.data);
            });
=======
    async function fetchUserQuizzes(){
        await axios.get(`http://${config.server}/quizzes/${id_user}/fromuser`)
                   .then((res)=>{
                       console.log(res.data);
                       setUserQuizzes(res.data);
                   });
>>>>>>> b9ce6c0... WIP Profile
    }

    async function fetchUserScores() {
        await axios.get(`http://${config.server}/scores/${id_user}/user`)
            .then((res) => {
                setUserScores(res.data);
            });
    }

    useEffect(() => {
        fetchUser();
        fetchUserQuizzes();
<<<<<<< HEAD
        fetchUserScores();
    }, [])
=======
        //fetchUserScores();
    },[])
>>>>>>> b9ce6c0... WIP Profile

    function userInfoJSX() {
        if (user !== undefined) {
            return (
                <div id={'top-profile'}>
                    <img></img>
                    <h1>{user.pseudo}</h1>
                </div>
            );
        } else {
            return (
                <h1>User not Found</h1>
            );
        }
    }

<<<<<<< HEAD
    function userQuizzesJSX() {
        if (userquizzes !== undefined && userquizzes.length > 0) {

            return (
                <ul id={"user-quizzes"}>
                    {
                        userquizzes.map(quizz => {
                            return (
                                <li><QuizzCard width={500} quizz={quizz} /></li>
                            )
                        })
                    }
                </ul>
=======
    function userQuizzesJSX(){
        if(userQuizzes !== undefined && userQuizzes.length > 0){
            console.log('lala')
            console.log(userQuizzes);
            
            
            return(
                <div id='user-quizzes' className='main-item'>
                    <ul>
                        {
                        userQuizzes.map(quizz => {
                            return(
                                <li><QuizzCard quizz={quizz} width={500}/></li>
                            )
                        })
                        }
                    </ul>
                </div>
>>>>>>> b9ce6c0... WIP Profile
            );
        } else {

        }
    }

    function userStatsJSX() {
<<<<<<< HEAD
        return (
            <div>
                <h5>Nombre de quizz crées : </h5>
                <h5>Nombre de questions crées : </h5>
                <h5>Nombre de participations aux quizz : </h5>
                <h5>Nombre de points marqués au total : </h5>
            </div>
        );
=======
        if(userScores !== undefined && userScores.length>0) {
            return(
                <div id='user-stats'>
                        <ul>
                        
                        </ul> 
                    </div>
            );
        }
>>>>>>> b9ce6c0... WIP Profile
    }

    return (
        <div id='profile-container'>

<<<<<<< HEAD
            <div id={"user-info"}>
            {userInfoJSX()}
=======
            <div id='center-profile'>
                    
                {userQuizzesJSX()}
                {userStatsJSX()}
>>>>>>> b9ce6c0... WIP Profile
            </div>

            

            <div id={'center-profile'}>

                <div id={"quizz"}>
                    {userQuizzesJSX()}
                </div>

                <div id='user-stats'>
                    {userStatsJSX()}
                </div>

            </div>

        </div>
    );
}
