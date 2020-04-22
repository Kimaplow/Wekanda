import React, {useEffect, UseState, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import './css/profile.css';

export default function Profile(){
    const {id_user} = useParams();

    const [user, setUser] = useState();

    async function fetchUser(){
        await axios.get(`http://${server}/user/${id_user}`)
    }

    return(
        <div id='profile-container'>
            <div i='top-profile'>
                <img></img>
                <h1></h1>
            </div>

            <div id='center-profile'>
                <div id='user-quizzes'>

                </div>

                <div id='user-stats'>

                </div>
            </div>
        </div>
    );
}
