import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

import './css/play.css';

export default function Play(){
    
    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});
    const [questions, setQuestions]  = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [currentidx, setCurrentidx] = useState([0]);

    const [score, setScore] = useState([0]);

    async function fetchQuizz(){
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
                   .then(res => {
                        setQuizz(res.data[0]);
                   });
    }
    async function fetchQuestions(){
        await axios.get(`http://${config.server}/quizzes/${id_quizz}/questions`)
                   .then(res => {
                        setQuestions(res.data);
                        setCurrentQuestion(res.data[currentidx]);
                   });
    }  

    async function fetchCurrentAnswers(){
            await axios.get(`http://${config.server}/questions/${currentQuestion.id_question}/answers`)
                   .then(res => {
                       
                       setCurrentAnswers(res.data);
                   });        
    }

    useEffect(() => {
        fetchQuizz();
        fetchQuestions();
    },[])
    
    useEffect(()=> {
        setCurrentQuestion(questions[currentidx]);
        console.log(currentQuestion)
    }, [currentidx]);

    return(

        <div id='play-container'>
            <div id='quizz-title'>
                <h2>{quizz ? quizz.title : "Quizz not found"}</h2>
            </div>
            <div id='question'>
                {currentQuestion ? <h2 id=''>{currentQuestion.question}</h2> : ""}
            </div>

            { currentAnswers ? 
                (<div id='answers'>
                    
                </div>)
                : "Answers not found"
            }
            <button onClick={() => {
                setCurrentidx(parseInt(currentidx)+1);
                console.log(currentidx)
            }}>
                Next
            </button>
        </div>
    );
}