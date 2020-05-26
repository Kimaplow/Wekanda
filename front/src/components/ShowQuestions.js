import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './css/showQuestion.css';
import {Icon, Button} from "react-materialize";

export default function EditQuizz() {

    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});
    const [questions, setQuestions]  = useState([]);

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then(res => {
                setQuizz(res.data[0]);
            });
    }

    async function getQuestions() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}/questions`)
            .then(res => {
                console.log("LAAAA");
                setQuestions(res.data);
            });
    }

    useEffect(() => {
        getQuizz();
        getQuestions();
    }, [])

    useEffect(() => {
        console.log('ICIIIII')
    }, [questions])

    async function deleteQuestion(q, idx, event){
        event.preventDefault();
        await axios.delete(`http://${config.server}/questions/${q.id_question}`);
        let tmp = questions.filter(item => item !== q);
        setQuestions(tmp);
    }

    function questionsJSX(){
        if(questions.length === 0){
            return (
                <div>
                    <h4>Pas de question !</h4>
                </div>   
            )
        }
        else{
            return questions.map((question, idx) => {
                return(
                    <h4 key={idx}>
                        {question.question}
                        <a href={`/questions/${id_quizz}/edit/${question.id_question}`} className="waves-effect waves-light btn editQuestion">
                            Modifier question
                        </a>
                        <Button onClick={event => {deleteQuestion(question, idx, event)}} node="button" waves="light" className="delete-question">
                            <Icon>delete</Icon>
                        </Button>
                    </h4>
                )
            })
        }
    }

    return (
        <div id="show-questions-container">

            <h3>{quizz.title}</h3>

            <div>
                {questionsJSX()}
            </div>

            <a href={`/questions/${id_quizz}/addQuestion`} className="waves-effect waves-light btn editQuestion">
                Ajouter question
            </a>

        </div>
    );
}