import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Checkbox } from 'react-materialize';
import './css/editQuestion.css';
import ReactPlayer from 'react-player';

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

    function uniqueName(filename) {
        if(filename){
            let index = filename.indexOf(".");
            let rootFilename = filename.substr(0, index);
            return rootFilename + Date.now() + filename.substr(index);
        }
        else{
            return '';
        }
    }

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
                <div key={idx}>
                    <div className="col s12">
                        <span className="label-rep">Reponse {idx + 1} : </span>
                        <input id={`reponse${idx}`} type="text" className="validate" placeholder={answer.answer} />
                        {cb}
                    </div>
                    {answer.path_file ? showMedia(answer) : false}
                    <div className="input-field inline">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input id={`fileAnswer${idx}`} type="file" name="fileAnswer"/>
                            </div>
                            <div className="file-path-wrapper">
                                <input id={`fileNameAnswer${idx}`} className="file-path validate" type="text"/>
                            </div>
                        </div>
                    </div>
                </div>
                
            )
        })
    }
 
    let eventuelReponsesJSX = [];
    for (let i = answers.length; i < 4; i++) {
        eventuelReponsesJSX.push(<div key={i} className="col s12">
            <div>
                <span className="label-rep">Reponse {i + 1} : </span>
                <input id={`reponse${i}`} type="text" className="validate" placeholder={"Exemple de réponse"} />
                <Checkbox label="Correct" id={`checked${i}`}></Checkbox>
            </div>
            
            <div className="input-field inline">
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input id={`fileAnswer${i}`} type="file" name="fileAnswer"/>
                    </div>
                    <div className="file-path-wrapper">
                        <input id={`fileNameAnswer${i}`} className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
        </div>
        );
    }

    function showMedia(q){
        if(q.path_file !== ''){
            let splitType = q.path_file.split('.');
            let type = splitType[splitType.length-1];
            if(type === 'mp4'){
                return (
                    <div id="div-media">
                        <ReactPlayer 
                        id='player' 
                        controls={true}
                        volume={0.5}
                        wrapper='div-media'
                        url={`http://${config.server}/video/${q.path_file}`}
                        />
                    </div>
                )
            }
            else{
                return (
                    <div id="div-media">
                        <img src={`http://${config.server}/img/${q.path_file}`} alt={`${q.path_file}`}></img>
                    </div>
                )
            }
        }
        else{
            return false;
        }
    }

    async function editQuestion(event){
        event.preventDefault();

        //On récupère la question et son éventuel fichier
        let ques = event.target.ques.value;
        let fileQuestion;

        if(event.target.fileQuestion.files[0]){
            fileQuestion = event.target.fileQuestion.files[0];
        }
        else{
            fileQuestion = null;
        }

        // On récupère les valeurs des "checked" des checkbox
        // On récupère les valeurs des réponses et les éventuels fichiers
        let tabCb = [];
        let tabReponses = [];
        let tabFichiersReponses = [];
        for(let i=0; i<4; i++){
            tabCb.push(document.getElementById("checked"+i).checked);
            tabReponses.push(document.getElementById("reponse"+i).value);
            let fichier = document.getElementById("fileAnswer"+i).files[0];
            if(fichier){
                tabFichiersReponses.push(fichier);
            }
            else{
                tabFichiersReponses.push(null);
            }
        }

        // Si aucune réponse n'est cochée comme correcte, on informe l'user
        if(tabCb[0] === false && tabCb[1] === false && tabCb[2] === false && tabCb[3] === false){
            alert("Il faut au moins une réponse coché comme correcte !");
            return false;
        }

        // on .patch les réponses existantes
        for(let i=0; i<answers.length; i++){
            if(tabReponses[i] !== '' || (tabCb[i] !== tabCorrect[i]) || tabFichiersReponses[i] !== null ){
                let data = new FormData();
                let id_answer = answers[i].id_answer;

                if(tabReponses[i] !== ''){
                    data.set('answer', tabReponses[i]);
                }

                if(tabCb[i] !== tabCorrect[i]){
                    console.log('CORRECT')
                    data.set('correct', tabCb[i]);
                }
                
                if(tabFichiersReponses[i] !== null){
                    let nameFile = uniqueName(document.getElementById('fileNameAnswer'+i).value);
                    data.set('path_file', nameFile);
                    data.append('fileAnswer', tabFichiersReponses[i]);
                }
                console.log(data.get('fileAnswer'));

                await axios.patch(`http://${config.server}/answers/${id_answer}`, data);
            }
        }
        
        // on .post les éventuelles nouvelles réponses
        for(let i=answers.length; i<4; i++){
            if(tabReponses[i] !== '' || tabFichiersReponses[i] !== null){
                let data = new FormData();

                data.set('id_question', question.id_question);
                
                if(tabReponses[i] !== ''){
                    data.set('answer', tabReponses[i]);
                }

                if(tabCb[i] !== tabCorrect[i]){
                    data.set('correct', tabCb[i]);
                }

                if(tabFichiersReponses[i] !== null){
                    let nameFile = uniqueName(document.getElementById('fileNameAnswer'+i).value);
                    data.set('path_file', nameFile);
                    data.append('fileAnswer', tabFichiersReponses[i]);
                }
                else{
                    data.set('path_file', '');
                }

                await axios.post(`http://${config.server}/answers/`, data);
            }
        }

        // on .patch la question si elle a changé
        if (ques !== '' || fileQuestion !== null) {

            let data = new FormData();
            if (fileQuestion === null) {
                data.set('question', ques);
            }
            else if(ques === '') {
                let nameFile = uniqueName(fileQuestion.name);
                data.set('path_file', nameFile);
                data.append('fileQuestion', fileQuestion);             
            }
            else {
                let nameFile = uniqueName(fileQuestion.name);
                data.set('question', ques);
                data.set('path_file', nameFile);
                data.append('fileQuestion', fileQuestion);
            }
            await axios.patch(`http://${config.server}/questions/${id_question}`, data);
        }

        // On rafraichit la page
        //window.location.reload();
    }

    return (
        <div id="edit-question-container">

            <h3>{quizz.title}</h3>

            <form onSubmit={event => editQuestion(event)} encType="multipart/form-data">

                <div className="col s12">
                    <span className="span-ques">Question : </span>
                    <input id="ques" type="text" className="validate itest" placeholder={question.question}/>
                    {question.path_file ? showMedia(question) : false}
                </div>

                <div className="col s12">
                    <div className="input-field inline">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input id="fileQuestion" type="file"/>
                            </div>
                            <div className="file-path-wrapper">
                                <input id="fileNameQuestion" className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="div-reponse">
                    {reponsesJSX(answers)}
                    {eventuelReponsesJSX}
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