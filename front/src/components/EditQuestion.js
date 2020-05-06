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
    let tabCorrect = [];

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
            let cb;
            let correct = answer.correct;
            tabCorrect.push(correct);
            if(correct === true){
                cb = <Checkbox label="Correct" id={`checked${idx}`} checked></Checkbox>
            }
            else{
                cb = <Checkbox label="Correct" id={`checked${idx}`}></Checkbox>
            }
            return(
                <div key={idx} className="col s12">
                    <span className="label-rep">Reponse {idx+1} : </span>
                    <input id={`reponse${idx}`} type="text" className="validate" placeholder={answer.answer}/>
                    {cb}
                </div>
            )
        })
    }

    async function editQuestion(event){
        event.preventDefault();

        console.log(tabCorrect);

        // On récupère les valeurs des "checked" des checkbox
        let tabCb = [];    
        for(let i=0; i<4; i++){
            tabCb.push(document.getElementById("checked"+i).checked);
        }

        //Si aucune réponse n'est cochée comme correcte, on informe l'user
        if(tabCb[0] === false && tabCb[1] === false && tabCb[2] === false && tabCb[3] === false){
            alert("Il faut au moins une réponse coché comme correcte !");
            return false;
        }

        let question = event.target.ques.value;
  
        // On récupère les valeurs des questions/réponses
        let tabReponses = [];
        for(let i=0; i<4; i++){
            tabReponses.push(document.getElementById("reponse"+i).value);
        }

        for(let i=0; i<4; i++){
            if(tabReponses[i] !== '' || (tabCb[i] !== tabCorrect[i]) ){
                let id_answer = answers[i].id_answer;
                let answer =  tabReponses[i];
                //path_file
                //correct
                let correct = tabCb[i];

                await axios.patch(`http://${config.server}/answers/${id_answer}`, {
                    'answer' : answer,
                    'correct': correct
                });

            }
        }

        if(question !== ''){
            await axios.patch(`http://${config.server}/questions/${id_question}`, {
                    'question' : question
                });
        }

        window.location.reload();

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