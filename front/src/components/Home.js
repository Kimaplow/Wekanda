import React, { useState } from 'react';
import './css/home.css';
import axios from "axios";
import { useEffect } from 'react';
import config from '../config';
import QuizzCard from './QuizzCard';

export default function Home() {

    const [tagsQuizzes, setTagsQuizzes] = useState([]);

    async function getQuizzes() {
        let quizzes = [];
        let tags = [];
        // first we get all the quizzes
        await axios.get(`http://${config.server}/quizzes/withtags`)
            .then(res => {
                quizzes = res.data;
            })
            .catch(err => console.log(err));
        // Then we get some tags 
        await axios.get(`http://${config.server}/tags`)
            .then(res => {
                tags = res.data;
            })
            .catch(err => console.log(err));
        // Eventually we bring themp up together to have for a tag all the quizzes associated to it
        let tmp = [];
        tags.map((t) => {
            quizzes.forEach(q => {
                if (q.tags && q.tags.includes(t.tag)) tmp.push(q);
            });
            t['quizzes'] = tmp;
            tmp = [];
        });
        setTagsQuizzes(tags);
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    let quizzJSX = tagsQuizzes.map((tq, index) =>
        <div className={"tq_tag"} key={index}>
            <h1>{tq.tag}</h1>
            {renderEachQuizz(tq.quizzes)}
        </div>
    );

    function renderEachQuizz(quizzes) {
        return quizzes.map(function (q, index){
            return (
            <div className={'card_quizz'} key={index}>
                <QuizzCard width={500} key={index} quizz={q} />
            </div>)
        });
    }


    return (
        <div id='container'>
            {quizzJSX}
        </div>
    );
}