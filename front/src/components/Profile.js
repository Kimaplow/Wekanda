import React, {useEffect, UseState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import './css/profile.css';

export default function Profile(){
    const {username} = useParams();
    return(
        <div id='profile-container'>
            <div i='top-profile'>
                <img></img>
                <h1>username</h1>
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
