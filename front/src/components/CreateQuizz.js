import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import config from '../config';


import AddQuizz from './AddQuizz';
import AddQuestion from './AddQuestion';

export default function CreateQuizz() {

    const { id_user } = useParams();
    const id_creator = id_user;

    const [idxPage, setIdxPage] = useState(0);
    const [quizz, setQuizz] = useState();
    const [questions, setQuestions] = useState([]);
    const [idQuizzCreated, setIdQuizzCreated] = useState();
    const [answers, setAnswers] = useState([]);

    let next;

    let onSubmitQuizz = (q, idxPage) => {
        setQuizz(q);
    }
    function onSubmitQuestion(q) {
        let tmp = [...questions];
        tmp[idxPage - 1] = q;
        setQuestions(tmp);
    }

    async function sendQuizz(q) {

        const bodyFormData = new FormData();
        if (id_creator) {
            bodyFormData.set('id_creator', id_creator);
        }
        bodyFormData.set('id_creator', id_creator);
        bodyFormData.set('title', q.title);
        bodyFormData.set('difficulty', q.difficulty);
        bodyFormData.set('path_file', q.fileName);
        bodyFormData.set('description', q.description);
        bodyFormData.append('file', q.file);

        const res = await axios.post(`http://${config.server}/quizzes/`, bodyFormData);
        setIdQuizzCreated(res.data.id_quizz);
    }

    async function sendQuestion(q) {
        const bodyFormData = new FormData();
        bodyFormData.set('id_quizz', idQuizzCreated);
        bodyFormData.set('question', q.question);
        bodyFormData.set('path_file', q.pathfile);

        await axios.post(`http://${config.server}/questions`, bodyFormData);
    }

    async function sendAnswer(a) {
        const bodyFormData = new FormData();
        bodyFormData.set('path_file', a.pathfile);
        bodyFormData.set('answer', a.answer);
        bodyFormData.set('correct', a.correct);

        await axios.post(`http://${config.server}/answers`, bodyFormData);
    }

    function sendDatas() {
        sendQuizz(quizz);
        console.log(quizz);
        for (const question of questions) {
            sendQuestion(question);
        }

        for (const answer of answers) {
            sendAnswer(answer);
        }

        // id_creator ? window.location=`/profile/${id_creator}` : window.location=`/`;
    }

    useEffect(() => { }, [idxPage]);
    useEffect(()=>{
        console.log('quizz :')
        console.log(quizz)
    }, [quizz])

    return (
        <div id='createQuizz-container'>
            {next = (questions[idxPage] !== undefined)}
            
            {idxPage === 0 && typeof quizz === {} ? <AddQuizz onSubmitQuizz={(q)=>onSubmitQuizz(q)} next={next}/> : ''}
            {idxPage === 0 && typeof quizz !== {} ? <AddQuizz quizz={quizz} onSubmitQuizz={(q)=>onSubmitQuizz(q)} next={next}/> : ''}
            {idxPage > 0 && typeof questions[idxPage - 1] !== undefined ? <AddQuestion question={questions[idxPage]} onSubmitQuestion={(q)=>onSubmitQuizz(q)} next={next}/> : ''}
            {idxPage > 0 && typeof questions[idxPage - 1] === undefined ? <AddQuestion onSubmitQuestion={(q)=>onSubmitQuizz(q)} next={next}/> : ''}

            {idxPage > 0 ?
                <button className="waves-effect waves-light btn-large"
                    type="submit"
                    onClick={() => { setIdxPage(idxPage - 1) }}>
                    <i className="material-icons">navigate_before</i>
                </button>
                : ''}


            {questions ?
                <button className="waves-effect waves-light btn-large"
                    type="submit"
                    onClick={() => { sendDatas() }}>
                    <i className="material-icons">done</i>
                </button>
                : ''}
        </div>
    );
}