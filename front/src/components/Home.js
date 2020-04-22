import React, { useState } from 'react';
import './css/home.css';
import axios  from "axios";
import { useEffect } from 'react';
import Quizz from './Quizz';
import config from '../config';

export default function Home() {

    const [filter, setFilter] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    async function getQuizzes() {
        console.log(config.server);
        await axios.get(`http://${config.server}/quizzes/`)
            .then(res => {
                console.log(res.data);
                setFilter(res.data);
                setQuizzes(res.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    
    const onChange = e => {
        if (e.target.value === '') setFilter(quizzes);
        else setFilter(quizzes.filter(q => q.title.toLowerCase().includes(e.target.value.toLowerCase())));
    };


    let quizzJSX = filter.map(q =>
        <Quizz
            title={q.title}
            img={`http://${config.server}/img/${q.path_file}`}
            id_quizz={q.id_quizz}
        />);

    return (
        <div id='container'>
            <input className={"search"} type="text" onChange={onChange} />
            {quizzJSX}
        </div>
    );
}