import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Checkbox } from 'react-materialize';
import './css/addQuestion.css';

export default function AddQuestion() {

    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then(res => {
                setQuizz(res.data[0]);
            });
    }

    useEffect(() => {
        getQuizz();
    }, [])

    async function addQuestion(event){
        event.preventDefault();

        let question = event.target.ques.value;

        if(question !== ''){
            await axios.post(`http://${config.server}/questions`, {
                    'id_quizz' : quizz.id_quizz,
                    'question' : question
                });
        }
        window.location=`/questions/${quizz.id_quizz}/edit`;
    }

    return (
        <div id="add-questions-container">

            <h3>{quizz.title}</h3>

            <form onSubmit={event => addQuestion(event)} encType="multipart/form-data">

                <div className="col s12">
                    <span className="span-ques">Question : </span>
                    <input id="ques" type="text" className="validate itest" placeholder={"Exemple de question"} />
                </div>

                <div className="col s12 btn-confirm">
                    <button className="waves-effect waves-light btn-large" type="submit">
                        Confirmer
                    </button>
                </div>

            </form>

        </div>
    );
}