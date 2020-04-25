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
        console.log(config.server);
        // first we get all the quizzes
        await axios.get(`http://${config.server}/quizzes/withtags`)
            .then(res => {
                console.log(res.data);
                quizzes = res.data;
            })
            .catch(err => console.log(err));
        // Then we get some tags 
        await axios.get(`http://${config.server}/tags`)
            .then(res => {
                console.log(res.data);
                tags = res.data;
            })
            .catch(err => console.log(err));
        // Eventually we bring themp up together to have for a tag all the quizzes associated to it
        let tmp = [];
        tags.map((t) => {
            quizzes.forEach(q => {
                if (q.tags.includes(t.tag)) tmp.push(q);
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
        <div className={"tq_tag"}>
            <h1>{tq.tag}</h1>
            {renderEachQuizz(tq.quizzes)}
        </div>
    );

    function renderEachQuizz(quizzes) {
        return quizzes.map(q => {
            return (
            <div className={'card_quizz'}>
                <QuizzCard width={500} quizz={q} />
            </div>);
        });
    }


    return (
        <div id='container'>
            {quizzJSX}
        </div>
    );
}