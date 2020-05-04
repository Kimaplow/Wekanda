import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Checkbox } from 'react-materialize';
import './css/editQuestion.css';

export default function EditQuestion() {

    const { id_quizz, id_question } = useParams();

    const [quizz, setQuizz] = useState({});
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then(res => {
                setQuizz(res.data[0]);
            });
    }

    async function getQuestion(){
        await axios.get(`http://${config.server}/questions/${id_question}`)
            .then(res => {
                setQuestion(res.data[0]);
            });
    }

    async function getAnswers(){
        await axios.get(`http://${config.server}/questions/${id_question}/answers`)
            .then(res => {
                setAnswers(res.data);
            });        
    }

    useEffect(() => {
        getQuizz();
        getQuestion();
        getAnswers();
    }, [])

    function reponsesJSX(answers){
        return answers.map((answer, idx) => {
            return(
                <div className="col s12">
                    <span className="label-rep">Reponse {idx+1} : </span>
                    <input id={`reponse${idx}`} type="text" className="validate" placeholder={answer.answer}/>
                    <Checkbox label="Correct" id={`checked${idx}`}></Checkbox>
                </div>
            )
        })
    }

    function editQuestion(event){
        event.preventDefault();
        
        let check0 = event.target.checked0.checked;
        let check1 = event.target.checked1.checked;
        let check2 = event.target.checked2.checked;

        let check3;
        if(event.target.checked3){
            check3 = event.target.checked3.checked;
        }
        else{
            check3 = 'Pas là';
        }
        
        alert(check3);
    }

    return (
        <div id="edit-question-container">

            <h3>{quizz.title}</h3>

            <form onSubmit={event => editQuestion(event)} encType="multipart/form-data">

                <div className="col s12">
                    <span className="span-ques">Question : </span>
                    <input id="ques" type="text" className="validate itest" placeholder={question.question}/>             
                </div>

                <div id="div-reponse">
                    {reponsesJSX(answers)}
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