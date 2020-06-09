import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './css/profile.css';
import { Icon, Button } from "react-materialize";
import QuizzCard from './QuizzCard';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";

export default function Profile() {
    const { id_user } = useParams();

    const [user, setUser] = useState(undefined);
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['login']);

    let totalpts = 0;
    const history = useHistory();

    async function fetchUser() {
        if (cookies.login) {
            const res = await axios.get(`http://${config.server}/users/profile`)
                .then(res => {
                    setUser(res.data);
                    return true;
                })
                .catch(err => false);
            if (!res) {
                setUser('not found');
                alert("Votre session a expirée");
                removeCookie('login');
                history.push('/signin')
            }
        } else {
            alert("Vous n'êtes pas connecté");
            history.push('/signin');
        }

    }

    async function fetchUserQuizzes() {
        await axios.get(`http://${config.server}/quizzes/fromuser/`)
            .then((res) => {
                setUserQuizzes(res.data);
            });
    }

    async function fetchUserScores() {
        await axios.get(`http://${config.server}/scores/user`)
            .then((res) => {
                setUserScores(res.data);
                userScores.map(score => {
                    totalpts += score.score;
                });
            });
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = (cookies.login ? 'Bearer ' + cookies.login.token : null);
        fetchUser();
        fetchUserQuizzes();
        fetchUserScores();
    }, [])


    useEffect(() => {

    }, [userQuizzes])

    async function deleteQuizz(quizz, idx, event) {
        event.preventDefault();
        await axios.delete(`http://${config.server}/quizzes/${quizz.id_quizz}/delete`);
        let tmp = userQuizzes.filter(item => item !== quizz);
        setUserQuizzes(tmp);
    }

    function renderUserJSX() {
        if (user) {
            return (
                <div id="user-info">
                        <h1>Bonjour, {user.pseudo}</h1>
                </div>
            );
        }

    }

    

    function renderStatsJSX() {
        return (
            <div id='user-stats'>
                <h5>Nombre de quizz créés : {userQuizzes ? userQuizzes.length : 0}</h5>
                <h5>Nombre de participations aux quizz : {userScores ? userScores.length : 0}</h5>
                <h5>Nombre de points marqués au total : {userScores ? totalpts : 0}</h5>
            </div>
        );
    }

    function userQuizzesJSX() {
        if (userQuizzes !== undefined && userQuizzes.length > 0) {

            return (

                <ul id="user-quizzes">
                    <div className='menu-quizz'>
                        <h3>Vos Quizz :</h3>
                        {user ?
                            <a href={`/user/${user.id_user}/createQuizz`} className="btn-floating btn-large waves-effect waves-light">
                                <Icon>add</Icon>
                            </a>
                            : undefined
                        }
                    </div>

                    {userQuizzes.map((quizz, idx) => {
                            return (
                                <li key={idx}>
                                    <QuizzCard quizz={quizz} />

                                    <Button
                                        onClick={event => {deleteQuizz(quizz, idx, event)}}
                                        node="button"
                                        waves="light"
                                        className="delete-quizz"
                                    >
                                        <Icon center>delete</Icon>
                                    </Button>
                                </li>
                            )
                        })
                    }

                </ul>
            );
        }
        else{
            return (
                <div className='menu-quizz'>
                    <h3>Aucun Quizz créé : </h3>
                    {user ?
                        <a href={`/user/${user.id_user}/createQuizz`} className="btn-floating btn-large waves-effect waves-light">
                            <Icon>add</Icon>
                        </a>
                        : undefined
                    }
                </div>
                
            );
        }
    }



    if (!cookies.login) return null;
    else {
        return (
            <div id='profile-container'>

                {renderUserJSX()}

                <div id={'center-profile'}>

                    <div id="quizz">
                        {userQuizzesJSX()}
                    </div>
            
                    {renderStatsJSX()}
                    
                </div>

            </div>
        );
    }

}
