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

    async function fetchUser() {
        await axios.get(`http://${config.server}/users/${id_user}`)
            .then((res) => {
                setUser(res.data[0]);
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
            });
    }

    useEffect(() => {
        fetchUser();
        fetchUserQuizzes();
        fetchUserScores();
    }, [])

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
            );
        } else {

        }
    }

    function userStatsJSX() {
        return (
            <div>
                <h5>Nombre de quizz crées : </h5>
                <h5>Nombre de questions crées : </h5>
                <h5>Nombre de participations aux quizz : </h5>
                <h5>Nombre de points marqués au total : </h5>
            </div>
        );
    }

    return (
        <div id='profile-container'>

            <div id={"user-info"}>
            {userInfoJSX()}
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
