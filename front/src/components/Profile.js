import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './css/profile.css';
import {Icon, Button} from "react-materialize";
import QuizzCard from './QuizzCard';
import {Redirect} from 'react-router-dom';

export default function Profile() {
    const { id_user } = useParams();

    const [user, setUser] = useState({});
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [userScores, setUserScores] = useState([]);

    let totalpts = 0;

    async function fetchUser() {
        await axios.get(`http://${config.server}/users/${id_user}`)
            .then((res) => {
                if (res.status === 200){
                    setUser(res.data[0]);
                }else{
                    setUser('not found');
                }
            });
    }

    async function fetchUserQuizzes() {
        await axios.get(`http://${config.server}/quizzes/${id_user}/fromuser/`)
            .then((res) => {
                setUserQuizzes(res.data);
            });
    }

    async function fetchUserScores() {
        await axios.get(`http://${config.server}/scores/${id_user}/user`)
            .then((res) => {
                setUserScores(res.data);
                userScores.map(score => {
                    totalpts+= score.score;
                });
            });
    }

    useEffect(() => {
        fetchUser();
        fetchUserQuizzes();
        fetchUserScores();  
    }, [])

    useEffect(() => {

    }, [userQuizzes])

    async function deleteQuizz(quizz, idx, event) {
        event.preventDefault();
        console.log("deleted")
        console.log(quizz.id_quizz);
        await axios.delete(`http://${config.server}/quizzes/${quizz.id_quizz}/delete`);
        let tmp = userQuizzes.filter(item => item !== quizz);
        setUserQuizzes(tmp);
    }

    function userQuizzesJSX() {
        if (userQuizzes !== undefined && userQuizzes.length > 0) {

            return (
                
                <ul id={"user-quizzes"}>
                    <div id="menu-quizz">
                        <h3>Vos Quizz :</h3>
                        <a href={`/user/${user.id_user}/addQuizz`} className="btn-floating btn-large waves-effect waves-light"><i className="material-icons">add</i></a>
                    </div>
                    
                    {
                        userQuizzes.map((quizz,idx) => {
                            return (
                                <li key={idx}>
                                    <QuizzCard width={500} quizz={quizz} />
                                    
                                    <Button
                                        onClick={event => {deleteQuizz(quizz, idx, event)}}
                                        node="button"
                                        waves="light"
                                        className="delete-quizz"
                                    >
                                    <Icon center>
                                            delete
                                    </Icon>
                                    </Button>
                                </li>
                                 
                            )
                        })
                    }
                </ul>
            );
        } else {
            return(
                <h2>Aucun Quizz créé</h2>
            );
        }
    }

    return (
        <div id='profile-container'>

            <div id={"user-info"}>
                {user && user === 'not found' ? <Redirect to='/' /> : ''}
                {user ? (<div id={'top-profile'}>
                            <img></img>
                            <h1>{user.pseudo}</h1>
                         </div>) 

                      : (<h1>User not found</h1>)
                }
            </div>

            

            <div id={'center-profile'}>

                <div id={"quizz"}>
                    {userQuizzesJSX()}
                </div>

                <div id='user-stats'>
                    <div>
                        <h5>Nombre de quizz créés : {userQuizzes ? userQuizzes.length : 0}</h5>
                        <h5>Nombre de participations aux quizz : {userScores ? userScores.length : 0}</h5>
                        <h5>Nombre de points marqués au total : {userScores ? totalpts : 0}</h5>
                    </div>
                </div>

            </div>

        </div>
    );
}
