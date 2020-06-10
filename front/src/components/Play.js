import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { Icon, Button, CardPanel} from 'react-materialize';
import { Redirect } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './css/play.css';
import * as apiget from '../APIcalls/APIget';

export default function Play() {
    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [currentidx, setCurrentidx] = useState(0);

    const [score, setScore] = useState(0);
    const [scoreDB, setScoreDB] = useState(undefined);

    const [chronoTermine, setChronoTermine] = useState(false);
    const [second, setSecond] = useState(15);

    /* flag to make it impossible to answer the same Q several times */
    const [answered, setAnswered] = useState(false);
       

    async function fetchQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then(res => {
                if (res.status === 200) {
                    setQuizz(res.data);
                } else {
                    setQuizz('not found');
                }
            });
    }

    async function fetchQuestions() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}/questions`)
            .then(res => {
                setQuestions(res.data);
                setCurrentQuestion(res.data[currentidx]);
            });
    }

    async function fetchCurrentAnswers() {
        await axios.get(`http://${config.server}/questions/${currentQuestion.id_question}/answers`)
            .then(res => {
                setCurrentAnswers(res.data);
            });
    }

    async function fetchCurrentAnswers() {
        await axios.get(`http://${config.server}/questions/${currentQuestion.id_question}/answers`)
            .then(res => {
                setCurrentAnswers(res.data);
            });
    }

    useEffect(() => {
        //setScoreDB(apiget.fetchScoreByQuizzAndUser(id_user, id_quizz)));
        fetchQuizz();
        fetchQuestions();
    }, [])

    useEffect(() => {
        setCurrentQuestion(questions[currentidx]);
    }, [currentidx]);

    useEffect(() => {
        if (currentQuestion) fetchCurrentAnswers();
    }, [currentQuestion]);

    
    useInterval(() => {
        if(second > 1){
            if(!chronoTermine){
                setSecond(second - 1)
            }
        }
        else{
            if(!chronoTermine){
                setSecond('Terminé');
                let a = {'correct' : false};
                handleAnswer(a);
            }
        }
    }, 1000)

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    function handleAnswer(answer){
        setChronoTermine(true);
        if (!answered) {
            /* Checking if the user has answered correctly */
            if (answer.correct) {
                setScore(parseInt(score) + 10);
                document.querySelector('#feedback').innerHTML = 'Bonne réponse !';
                
            } else {
                setScore(parseInt(score) - quizz.difficulty * 2)
                document.querySelector('#feedback').innerHTML = 'Mauvaise réponse !';
            }

            document.querySelector('#feedback').style.visibility = 'visible';

            for (const i of document.querySelectorAll('.material-icons')) {
                i.style.visibility = 'visible';
            }
            setAnswered(true);

            /* Checking if the quizz is over */
            if (currentidx < questions.length - 1){
                document.querySelector('#next-button').style.visibility = 'visible';
            }
            else{
                //On post le score
                document.querySelector('#finish-button').style.visibility = 'visible';
            }
        }

    }

    function handleNext() {
        for (const i of document.querySelectorAll('.material-icons')) {
            i.style.visibility = 'hidden';
        }
        document.querySelector('#next-button').style.visibility = 'hidden';
        document.querySelector('#feedback').style.visibility = 'hidden';
        setCurrentidx(parseInt(currentidx) + 1);
        setAnswered(false);
        setChronoTermine(false);
        setSecond(15);
    }

    function displayQuestion(q) {
        console.log(q)
        
        return (
            <div id='question'>
                {q.path_file !== '' ?
                    <ReactPlayer
                        id='player'
                        controls={true}
                        volume={0.5}
                        wrapper='question'
                        url={`http://${config.server}/video/${q.path_file}`} /> : ''}
                <h2>{q.question}</h2>
            </div>
        )
        
    }
  
    return (

        <div id='play-container'>

            <div id='quizz-title'>
                {quizz && quizz === 'not found' ? <Redirect to='/' /> : ''}
                <h2>{quizz ? quizz.title : "Quizz not found"}</h2>
            </div>

            {currentQuestion ? displayQuestion(currentQuestion) : ''}

            <div id='score'>
                <h2>Score : {score}</h2>
            </div>

            <div id='chrono'>
                Temps restant : {second}
            </div>

            <div id='answers'>
                {currentAnswers ?
                    currentAnswers.map((a, idx) => {
                        if (a.path_file.split('.')[1] !== 'jpg') {
                            return (
                                <CardPanel className="answer" key={idx} id={'answer'+idx} onClick={e=>{handleAnswer(a)}}>
                                    <span className="white-text">
                                        {a.answer}
                                    </span>
                                    {a.correct ? <Icon>check</Icon> : <Icon>clear</Icon>}
                                </CardPanel>
                            );
                        } else {
                            return (
                                <CardPanel style={{
                                    backgroundImage: 'url(' + `http://${config.server}/img/${a.path_file}` + ')'}}
                                    className="answer" key={idx} id={'answer'+idx} onClick={e=>{handleAnswer(a)}}
                                >
                                    {a.correct ? <Icon>check</Icon> : <Icon>clear</Icon>}
                                </CardPanel>
                            );
                        }
                    }) : "Answers not found"
                }
            </div>

            <div>
                <p id='feedback'></p>
            </div>

            <div>
                <Button id='next-button' onClick={e => { handleNext() }}>Next</Button>
            </div>

            <div>
                <Button id='finish-button'>Terminer</Button>
            </div>

        </div>
    );
}