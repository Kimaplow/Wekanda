import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

import Question from './Question';
import './css/play.css';

export default function Play(){
    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});
    const [questions, setQuestions]  = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [currentidx, setCurrentidx] = useState(0);

    const [score, setScore] = useState(0);

    /* flag to make it impossible to answer the same Q several times */
    const [answered, setAnswered] = useState(false)

    async function fetchQuizz(){
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
                   .then(res => {
                       console.log(res.status);
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
    }, [currentidx]);

    useEffect(()=> {
        if(currentQuestion)fetchCurrentAnswers();
    }, [currentQuestion]);

    function handleAnswer(answer){
        if (!answered) {
            /* Checking if the user has answered correctly */
            if(answer.correct){
                setScore(parseInt(score)+10);
            }else{
                setScore(parseInt(score)-quizz.difficulty*2)
            }
            for(const i of document.querySelectorAll('.material-icons')){
                i.style.visibility = 'visible';
            }
            setAnswered(true);
            
            /* Checking if the quizz is over */
            if (currentidx<questions.length-1)
                {document.querySelector('#next-button').style.visibility='visible';}
            else
                {document.querySelector('#finish-button').style.visibility='visible';}
        }else{

        }    
    }

    return(

        <div id='play-container'>
            <div id='quizz-title'>
                <h2>{quizz ? quizz.title : "Quizz not found"}</h2>
            </div>
            {currentQuestion ? <Question question={currentQuestion.question} src={currentQuestion.path_file}/> : ''}
            <div id='score'>
                <h2>Score : {score ? score : 0}</h2>
            </div>
            <div id='answers'>
                { currentAnswers ? 
                    currentAnswers.map((a, idx) => {
                        if(a.path_file.split('.')[1] !== 'jpg'){
                            console.log('pas image')
                            return(
                                <div className='answer' 
                                     id={'answer'+idx} 
                                     key={idx}
                                     onClick={e => {handleAnswer(a)}}>
                                        <h2>{a.answer}</h2>
                                       {a.correct ? <i className='material-icons'>check</i> : 
                                                    <i className='material-icons'>clear</i>}
                                  </div>
                            );
                        }else{
                            return(
                                <div className='answer' 
                                id={'answer'+idx} 
                                key={idx}
                                onClick={e => {handleAnswer(a)}}
                                style={{
                                    backgroundImage: 'url(' + `http://${config.server}/img/${a.path_file}` + ')',
                                }}>
                                  {a.correct ? <i className='material-icons'>check</i> : 
                                               <i className='material-icons'>clear</i>}
                                </div>
                                );  
                        }
                            
                    }) : "Answers not found"
                }
            </div>
            
            <button id='next-button' onClick={e => {
                for(const i of document.querySelectorAll('.material-icons')){
                    i.style.visibility = 'hidden';
                }
                document.querySelector('#next-button').style.visibility='hidden';
                setCurrentidx(parseInt(currentidx)+1);
                setAnswered(false);                              
            }}>Next</button>
            
            <button id='finish-button'>
                GG !
            </button>
        </div>
    );
}