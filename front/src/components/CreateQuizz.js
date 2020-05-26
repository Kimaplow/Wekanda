import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import * as apipost from '../APIcalls/APIpost';
import * as apiget from '../APIcalls/APIget';
import * as apipatch from '../APIcalls/APIpatch';

import AddQuizz from './AddQuizz';
import AddQuestion from './AddQuestion';

export default function CreateQuizz() {

    const { id_user } = useParams();
    const { id_quizz } = useParams();
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

    function sendDatas(event) {
        event.preventDefault();
        if (id_creator) {
            quizz.id_creator = id_creator;
            setIdQuizzCreated(apipost.sendQuizz(quizz));

            // for (const question of questions) {
            // question.id_quizz = idQuizzCreated;
            //     apipost.sendQuestion(question);
            // }

            // for (const answer of answers) {
            //     apipost.sendAnswer(answer);
            // }

        } else {
            console.log(quizz)
            apipatch.updateQuizz(quizz);
            // console.log('update')
            for (const question of questions) {
                apipatch.updateQuestion(question);
            }

            for (const answer of answers) {
                apipatch.updateAnswer(answer);
            }
        }

        // for (const tagQuizz of tagsQuizz) {
        //     apipost.sendTagQuizz(tagQuizz.tag, idQuizzCreated)
        //     if(!tags.contains(tagsQuizz.tag)){
        //         apipost.sendNewTag(tagsQuizz.tag)
        //     }
        // }

        // id_creator ? window.location = `/profile/${id_creator}` : window.location = `/`;
    }

    function onChange() {
        setIsSaved(false);
    }

    useEffect(() => {
        if (id_quizz) {
            apiget.fetchQuizz(id_quizz).then(res => setQuizz(res));
            apiget.fetchQuestionsOfQuizz(id_quizz).then(res => { setQuestions(res);});
            for (const question of questions) {
                const tmp = [...answers];
                apiget.fetchAnswersOfQuestion(question.id_question).then(res => {
                    setAnswers(tmp, [res])
                })
            }
            apiget.fetchTagsOfQuizz(id_quizz).then(res => {
                setTagsQuizz(res);
            });
            setIsSaved(true);
        }
        apiget.fetchAllTags().then(res => setTags(res));
    }, []);
    useEffect(() => {
        if (questions) {
            next = (questions[idxPage] !== undefined)
        }
    }, [idxPage, isSaved, quizz, questions]);

    return (
        <div id='createQuizz-container'>

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
                    onSubmitQuestion={(q) => onSubmitQuestion(q)}
                    onChange={e => onChange()} /> : ''}

            {idxPage > 0 && typeof questions[idxPage - 1] === undefined ?
                <AddQuestion onSubmitQuestion={(q) => onSubmitQuestion(q)}
                    onChange={e => onChange()} /> : ''}

            {idxPage > 0 ?
                <button className="waves-effect waves-light btn-large"
                    onClick={event => { setIdxPage(idxPage - 1) }}
                    name="action">
                    <i className="material-icons">
                        navigate_before
                    </i>
                </button>
                : ''}

            {quizz ?
                <button className="waves-effect waves-light btn-large"
                    name="action"
                    onClick={event => { setIdxPage(idxPage + 1) }}>
                    <i className="material-icons">
                        {next === true ? 'navigate_next' : 'add'}
                    </i>
                </button>
                : ''}

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