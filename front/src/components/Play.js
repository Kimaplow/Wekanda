import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
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
    const [currentidx, setCurrentidx] = useState(0);

    const [score, setScore] = useState(0);

    const [answered, setAnswered] = useState(false)

    let nextButton;

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
                    //    console.log(res.data)
                       setCurrentAnswers(res.data);
                   });        
    }

    useEffect(() => {
        fetchQuizz();
        fetchQuestions();
        nextButton = document.getElementById('next-button');
    },[])
    
    useEffect(()=> {
        setCurrentQuestion(questions[currentidx]);
    }, [currentidx]);

    useEffect(()=> {
        fetchCurrentAnswers();
    }, [currentQuestion])

    function handleAnswer(answer){
        if (!answered) {
            if(answer.correct){
                setScore(parseInt(score)+10);
            }else{
                
            }
            setAnswered(true);
            ReactDOM.findDOMNode(nextButton).style.color = 'blue';
        }else{

        }    
        console.log('reponse');
    }

    return(

        <div id='play-container'>
            <div id='quizz-title'>
                <h2>{quizz ? quizz.title : "Quizz not found"}</h2>
            </div>
            <div id='question'>
                {currentQuestion ? <h2>{currentQuestion.question}</h2> : ""}
            </div>
            <div id='score'>
                <h2>Score : {score ? score : 0}</h2>
            </div>
            <div id='answers'>
                { currentAnswers ? 
                    currentAnswers.map((a, idx) => {
                        return(
                            <div className='answer' 
                                 id={'answer'+idx} 
                                 key={idx}
                                 onClick={e => {handleAnswer(a)}}>
                                    <h2>{a.answer}</h2>
                            </div>
                        );
                    }) : "Answers not found"
                }
            </div>
            
            <button id='next-button' onClick={e => {
                setCurrentidx(parseInt(currentidx)+1);
                setAnswered(false);
            }}>Next</button>
        </div>
    );
}