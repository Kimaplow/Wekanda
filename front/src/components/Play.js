import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { Icon, Button, CardPanel, Modal } from 'react-materialize';
import { Redirect, useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './css/play.css';
import * as apiget from '../APIcalls/APIget';
import { useCookies } from 'react-cookie';
import sleep from '../tools/sleep';

export default function Play() {
    const { id_quizz } = useParams();
    const history = useHistory();

    const [quizz, setQuizz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(undefined);
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [currentidx, setCurrentidx] = useState(0);

    const [score, setScore] = useState(0);
    const [scoreDB, setScoreDB] = useState(undefined);

    const [chronoTermine, setChronoTermine] = useState(false);
    const [second, setSecond] = useState(15);

    /* flag to make it impossible to answer the same Q several times */
    const [answered, setAnswered] = useState(false);

    const [alert, setAlert] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['login']);
    const [user, setUser] = useState(undefined);

    /** We first verify that the user is connected in order to play a quizz */
    async function verifyToken() {
        axios.defaults.headers.common['Authorization'] = (cookies.login ? 'Bearer ' + cookies.login.token : null);
        await axios.get(`http://${config.server}/users/verify_token`, { responseType: 'text' })
            .catch(async err => {
                setAlert(<CardPanel className="orange"><Icon tiny>error</Icon>Merci de vous connecter</CardPanel>);
                await sleep(2500);
                history.push('/signin');
            })
    }

    async function fetchUser() {
        if (cookies.login) {
            const res = await axios.get(`http://${config.server}/users/profile`)
                .then(res => {
                    setUser(res.data);
                    return true;
                })
                .catch(err => false);
        }
    }

    async function getScore() {
        await axios.get(`http://${config.server}/scores/${user.id_user}/user/${id_quizz}/quizz`)
            .then(res => {
                setScoreDB(res.data);
            });
    }

    async function fetchQuizz() {
        axios.defaults.headers.common['Authorization'] = (cookies.login ? 'Bearer ' + cookies.login.token : null);
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

    async function postScore() {
        let req = {
            id_quizz: quizz.id_quizz,
            score: score
        }
        await axios.post(`http://${config.server}/scores`, req);
        document.querySelector('#postScore').innerHTML = 'Score envoyé !'
        document.querySelector('#postScore').disabled = 'disabled';
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = (cookies.login ? 'Bearer ' + cookies.login.token : null);
        fetchUser();
        verifyToken();
        fetchQuizz();
        fetchQuestions();
    }, [])

    useEffect(() => {
        if (user) {
            getScore();
        }
    }, [user])

    useEffect(() => {
        setCurrentQuestion(questions[currentidx]);
    }, [currentidx]);

    useEffect(() => {
        if (currentQuestion) fetchCurrentAnswers();
    }, [currentQuestion]);


    useInterval(() => {
        if (second > 1) {
            if (!chronoTermine) {
                setSecond(second - 1)
            }
        }
        else {
            if (!chronoTermine) {
                setSecond('Terminé');
                let a = { 'correct': false };
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

    function handleAnswer(answer) {
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
            if (currentidx < questions.length - 1) {
                document.querySelector('#next-button').style.visibility = 'visible';
            }
            else {
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
        let media = undefined;
        let chemin = q.path_file;

        if (chemin !== '') {
            if (chemin.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                media = <img src={`http://${config.server}/img/${q.path_file}`} alt={`${q.path_file}`}></img>

            }
            else {
                media = <ReactPlayer
                    id='player'
                    controls={true}
                    volume={0.5}
                    wrapper='question'
                    url={`http://${config.server}/video/${q.path_file}`}
                />
            }
        }
        return (
            <div id='question'>
                {media}
                <h2>{q.question}</h2>
            </div>
        )
    }


    const trigger = <Button id='finish-button'>Terminer</Button>

    if (alert) {
        return (
            <span id="alert-box">
                {alert}
            </span>
        )
    }
    else {
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
                                    <CardPanel className="answer" key={idx} id={'answer' + idx} onClick={e => { handleAnswer(a) }}>
                                        <span className="white-text">
                                            {a.answer}
                                        </span>
                                        {a.correct ? <Icon>check</Icon> : <Icon>clear</Icon>}
                                    </CardPanel>
                                );
                            } else {
                                return (
                                    <CardPanel style={{
                                        backgroundImage: 'url(' + `http://${config.server}/img/${a.path_file}` + ')'
                                    }}
                                        className="answer" key={idx} id={'answer' + idx} onClick={e => { handleAnswer(a) }}
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
                    <Modal header={quizz ? quizz.title : undefined} trigger={trigger}
                        actions={[
                            <Button id="postScore" node="button" onClick={e => { postScore() }}>Envoyer le score</Button>,
                            <Button flat modal="close" node="button"><Icon className="close-modal">close</Icon></Button>
                        ]}
                    >
                        <p>Votre meilleur score : {scoreDB ? scoreDB.score : 'Vous n\'avez pas encore de score pour ce quizz'}</p>
                        <p>Votre score actuel : {score ? score : undefined}</p>
                    </Modal>
                </div>

            </div>
        );
    }
}