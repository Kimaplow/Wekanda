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
    const [isSaved, setIsSaved] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagsQuizz, setTagsQuizz] = useState([]);
    let next;

    let onSubmitQuizz = (q, idxPage) => {
        setQuizz(q);
        setIsSaved(true);
    }
    function onSubmitQuestion(q, a) {
        let tmp = [...questions];
        tmp[idxPage - 1] = q;
        setQuestions(tmp);
        tmp[idxPage - 1] = a;
        setAnswers(tmp);
        setIsSaved(true);
    }

    async function fetchTags() {
        await axios.get(`http://${config.server}/tags`)
            .then(res => {
                setTags(res.data);
            });
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

    async function sendTagQuizz(t) {
        const bodyFormData = new FormData();
        bodyFormData.set('id_quizz', idQuizzCreated);
        bodyFormData.set('tag', t.tag);

        await axios.post(`http://${config.server}/tagsquizzes`, bodyFormData);
    }
    async function sendNewTag(t) {
        const bodyFormData = new FormData();
        bodyFormData.set('tag', t)
        axios.post(`http://${config.server}/tags`, bodyFormData);
    }

    function sendDatas(event) {
        event.preventDefault();
        sendQuizz(quizz);
        // for (const question of questions) {
        //     sendQuestion(question);
        // }

        // for (const answer of answers) {
        //     sendAnswer(answer);
        // }
        // for (const tagQuizz of tagsQuizz) {
        //     sendTagQuizz(tagQuizz)
        //     if(!tags.contains(tagsQuizz.tag)){
        //         sendNewTag(tagsQuizz.tag)
        //     }
        // }
        id_creator ? window.location = `/profile/${id_creator}` : window.location = `/`;
    }

    function onChange() {
        setIsSaved(false);
    }
    useEffect(() => { fetchTags() }, []);
    useEffect(() => { console.log(idxPage) }, [idxPage, isSaved]);
    useEffect(() => {
    }, [quizz])

    return (
        <div id='createQuizz-container'>
            {next = (questions[idxPage] !== undefined)}

            {isSaved ? <p id='saved'>sauvegardé</p> : <p id='saved'>non sauvegardé</p>}

            {idxPage === 0 && typeof quizz === {} ?
                <AddQuizz onSubmitQuizz={(q) => onSubmitQuizz(q)}
                          onChange={e => onChange()} /> : ''}

            {idxPage === 0 && typeof quizz !== {} ?
                <AddQuizz quizz={quizz}
                    onSubmitQuizz={(q) => onSubmitQuizz(q)}
                    onChange={e => onChange()} /> : ''}

            {idxPage > 0 && typeof questions[idxPage - 1] !== undefined ?
                <AddQuestion question={questions[idxPage]}
                             onSubmitQuestion={(q) => onSubmitQuizz(q)}
                             onChange={e => onChange()} /> : ''}

            {idxPage > 0 && typeof questions[idxPage - 1] === undefined ?
                <AddQuestion onSubmitQuestion={(q) => onSubmitQuizz(q)}
                             onChange={e => onChange()} /> : ''}

            <button className="waves-effect waves-light btn-large"
                name="action"
                onClick={event => {setIdxPage(idxPage+1)}}>
                <i className="material-icons">
                    {next == true ? 'navigate_next' : 'add'}
                </i>
            </button>
            <button className="waves-effect waves-light btn-large"
                onClick={event => { setIdxPage(idxPage-1) }}
                name="action">
                <i className="material-icons">
                    navigate_before
                </i>
            </button>
            {questions ?
                <button className="waves-effect waves-light btn-large"
                    type="submit"
                    onClick={e => { sendDatas(e) }}>
                    <i className="material-icons">done</i>
                </button>
                : ''}
        </div>
    );
}