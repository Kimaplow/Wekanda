import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import config from '../config';
import './css/profile.css';

import QuizzCard from './elements/QuizzCard';

export default function Profile(){
    const {id_user} = useParams();

    const [user, setUser] = useState({});
    const [userquizzes, setUserquizzes] = useState([]);

    async function fetchUser(){
        await axios.get(`http://${config.server}/users/${id_user}`)
                    .then((res)=>{
                        setUser(res.data[0]);
                    });
    }

    async function fetchUserQuizzes(){
        await axios.get(`http://${config.server}/quizzes/fromuser/${id_user}`)
                   .then((res)=>{
                       setUserquizzes(res.data);
                   });
    }

    useEffect(()=>{
        fetchUser();
        fetchUserQuizzes();
    },[])

    function userInfoJSX(){
        if(user !== undefined) {
            return (
                <div i='top-profile'>
                    <img></img>
                    <h1>{user.pseudo}</h1>
                </div>
            );
        }else{
            return(
                <h1>User not Found</h1>
            );
        }
    }

    function userQuizzesJSX(){
        if(userquizzes !== undefined && userquizzes.length > 0){
            console.log('lala')
            console.log(userquizzes);
            
            
            return(
                <div id='user-quizzes' className='main-item'>
                    <ul>
                        {
                            userquizzes.map(quizz => {
                                return(
                                    <li><QuizzCard quizz={quizz} heigth={100} width={100}/></li>
                                )
                            })
                        }
                    </ul>
                    
                </div>
            );
        }else{

        }
    }

    return(
        <div id='profile-container'>
            
            {userInfoJSX()}

            <div id='center-profile'>
                    
                {userQuizzesJSX()}
                    <div id='user-stats'>

                    </div>
            </div>
            
        </div>
    );
}
