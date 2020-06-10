import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { TextInput, Checkbox } from 'react-materialize';
import ReactPlayer from 'react-player';
import './css/formQuestion.css';

export default function EditQuestion() {

    //nombre de réponses max
    const TAILLE_MAX = 4;

    const { id_quizz, id_question } = useParams();
    let add = false;
    //si pas d'id_question, on est en mode add
    if(id_question === undefined){
        add = true;
    }

    const [quizz, setQuizz] = useState({});
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    let tabCorrect = [];

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then(res => {
                setQuizz(res.data);
            });
    }

    async function getQuestion(){
        await axios.get(`http://${config.server}/questions/${id_question}`)
            .then(res => {
                setQuestion(res.data);
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
        if(!add){
            getQuestion();
            getAnswers();
        }     
    }, [])

    function reponsesJSX(answers) {
          
        let cb;
        let nbrAnswers = answers.length;
        let form = []; 
        let correct = false;
        for(let i=0; i<TAILLE_MAX; i++){
            cb = <Checkbox label="Correct" id={`checked${i}`}></Checkbox>      
            if(i<nbrAnswers){           
                correct = answers[i].correct;
                if(correct === true){
                    cb = <Checkbox label="Correct" id={`checked${i}`} checked></Checkbox>
                }
                tabCorrect.push(correct);
            }
            form.push(
                <div key={i}>
                    <div className="col s12">
                        <div className="input-field inline">
                            <TextInput
                                id={`reponse${i}`}
                                label={'Réponse ' + (i+1)}
                                placeholder={answers[i] !== undefined ? answers[i].answer : 'Example'}
                            />
                        </div>
                        {cb}
                    </div>
                
                    {answers[i] !== undefined ? showMedia(answers[i]) : ''}

                    <div className="col s12">
                        <div className="input-field inline">
                            <TextInput
                                id={`fileAnswer${i}`}
                                label="File"
                                type="file"
                                name="fileAnswer"
                            />
                        </div>
                    </div>
                </div>
            )          
        }
        return form;
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
    }

    async function sendRequest(event){
        event.preventDefault();
        
        let ques = event.target.formQuestion.value;
        let fileQuestion = null;

        if (event.target.fileQuestion.files[0]) {
            fileQuestion = event.target.fileQuestion.files[0];
        }

        if(add){
            if(ques === ''){
                return alert('Entrer une question valide !')
            }

            if (fileQuestion !== null) {
                let data = new FormData();
                let nameFile = fileQuestion.name;
                data.set('id_quizz', quizz.id_quizz);
                data.set('question', ques);
                data.set('path_file', nameFile);
                data.append('fileQuestion', fileQuestion);

                await axios.post(`http://${config.server}/questions`, data);
            }
            else{
                await axios.post(`http://${config.server}/questions`, {
                    'id_quizz' : quizz.id_quizz,
                    'question' : ques
                });
            }
                
            window.location=`/questions/${quizz.id_quizz}/edit`;
        }
        else {

            // On récupère les valeurs des "checked" des checkbox
            // On récupère les valeurs des réponses et les éventuels fichiers
            let tabCb = [];
            let tabReponses = [];
            let tabFichiersReponses = [];
            for (let i = 0; i < TAILLE_MAX; i++) {
                tabCb.push(document.getElementById("checked" + i).checked);
                tabReponses.push(document.getElementById("reponse" + i).value);
                let fichier = document.getElementById("fileAnswer" + i).files[0];
                if (fichier) {
                    tabFichiersReponses.push(fichier);
                }
                else {
                    tabFichiersReponses.push(null);
                }
            }

            // Si aucune réponse n'est cochée comme correcte, on informe l'user
            if (tabCb[0] === false && tabCb[1] === false && tabCb[2] === false && tabCb[3] === false) {
                return alert("Il faut au moins une réponse coché comme correcte !");
            }

            // on .patch les réponses existantes
            for (let i = 0; i < answers.length; i++) {
                if (tabReponses[i] !== '' || (tabCb[i] !== tabCorrect[i]) || tabFichiersReponses[i] !== null) {
                    let data = new FormData();
                    let id_answer = answers[i].id_answer;

                    if (tabReponses[i] !== '') {
                        data.set('answer', tabReponses[i]);
                    }

                    if (tabCb[i] !== tabCorrect[i]) {
                        data.set('correct', tabCb[i]);
                    }

                    if (tabFichiersReponses[i] !== null) {
                        let nameFile = document.getElementById('fileNameAnswer' + i).value;
                        data.set('path_file', nameFile);
                        data.append('fileAnswer', tabFichiersReponses[i]);
                    }

                    await axios.patch(`http://${config.server}/answers/${id_answer}`, data);
                }
            }

            // on .post les éventuelles nouvelles réponses
            for (let i = answers.length; i < TAILLE_MAX; i++) {
                if (tabReponses[i] !== '' || tabFichiersReponses[i] !== null) {
                    let data = new FormData();

                    data.set('id_question', question.id_question);

                    if (tabReponses[i] !== '') {
                        data.set('answer', tabReponses[i]);
                    }

                    if (tabCb[i] !== tabCorrect[i]) {
                        data.set('correct', tabCb[i]);
                    }

                    if (tabFichiersReponses[i] !== null) {
                        let nameFile = tabFichiersReponses[i].name;
                        data.set('path_file', nameFile);
                        data.append('fileAnswer', tabFichiersReponses[i]);
                    }
                    else {
                        data.set('path_file', '');
                    }

                    console.log(data.get('id_question'), data.get('answer'), data.get('correct'), data.get('path_file'), data.get('fileAnswer'));

                    await axios.post(`http://${config.server}/answers/`, data);
                }
            }

            // on .patch la question si elle a changé
            if (ques !== '' || fileQuestion !== null) {

                let data = new FormData();
                if (fileQuestion === null) {
                    data.set('question', ques);
                }
                else if (ques === '') {
                    let nameFile = fileQuestion.name;
                    data.set('path_file', nameFile);
                    data.append('fileQuestion', fileQuestion);
                }
                else {
                    let nameFile = fileQuestion.name;
                    data.set('question', ques);
                    data.set('path_file', nameFile);
                    data.append('fileQuestion', fileQuestion);
                }
                await axios.patch(`http://${config.server}/questions/${id_question}`, data);
            }

            // On rafraichit la page
            window.location.reload();
        }
    }
    
    return (
        <div id="form-questions-container">

            <h3>{quizz.title}</h3>

            <form onSubmit={event => sendRequest(event)} encType="multipart/form-data">

                <div id="form-question-question" className="col s12">
                    <div className="input-field inline">
                        <TextInput
                            id="formQuestion"
                            label='Question'
                            placeholder={add ? 'Example' : question.question }
                        />
                        {question.path_file ? showMedia(question) : false}
                    </div>
                </div>

                <div className="col s12">
                    <div className="input-field inline">
                        <div className="file-field input-field">
                            <TextInput
                            id="fileQuestion"
                            label="File"
                            type="file"
                            name="fileQuestion"
                            />
                        </div>
                    </div>
                </div>

                {!add ? 
                    <div id="div-reponse">
                        {reponsesJSX(answers)}
                    </div>
                    : ''
                }

                <div id="div-confirmer" className="col s12">
                    <button className="waves-effect waves-light btn-large" type="submit">
                        Confirmer
                    </button>
                </div>

            </form>

        </div>
    );

}