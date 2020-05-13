import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './css/showQuestion.css';

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

    async function getQuestions(){
        await axios.get(`http://${config.server}/quizzes/${id_quizz}/questions`)
                   .then(res => {
                        setQuestions(res.data);
                   });
    }

    useEffect(() => {
        getQuizz();
    }, [])

    useEffect(() => {
        getQuestions();
    }, [])

    function questionsJSX(ques){
        if(ques.length === 0){
            return (
                <div>
                    <h4>Pas de question !</h4>
                    <a href={`/questions/${id_quizz}/addQuestion`} className="waves-effect waves-light btn editQuestion">
                        Ajouter question
                    </a>
                </div>   
            )
        }
        else{
            return ques.map((question, idx) => {
                return(
                    <h4 key={idx}>
                        {question.question}
                        <a href={`/questions/${id_quizz}/edit/${question.id_question}`} className="waves-effect waves-light btn editQuestion">
                            Modifier question
                        </a>
                    </h4>
                )
            })
        }
    }

    return (
        <div id="show-questions-container">

            <h3>{quizz.title}</h3>

            <div>
                {questionsJSX(questions)}
            </div>

            <a href={`/questions/${id_quizz}/addQuestion`} className="waves-effect waves-light btn editQuestion">
                Ajouter question
            </a>

        </div>
    );
}