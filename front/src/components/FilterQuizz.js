import React, {useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import config from "../config";
import QuizzCard from "./QuizzCard";

export default function FilterQuizz() {

    const { tag } = useParams();
    const [quizzes, setQuizzes] = useState([]);

    async function getQuizzesFiltered() {
        await axios.get(`http://${config.server}/quizzes/withtags/${tag}`)
            .then(res => {
                setQuizzes(res.data);
            })
            .catch(err => console.log(err));
    }

    let quizzJSX = quizzes.map(function (q, index){
        return (<QuizzCard key={index} quizz={q} />);
    });

    //let quizzJSX = quizzes.map(q => <QuizzCard quizz={q} />);

    useEffect(() => {
        getQuizzesFiltered() 
    },[tag]);

    return (
        <div id="quizzes-filtered">
            <h1> Quizz appartenant à la catégorie: {tag} </h1>
            {quizzJSX}
        </div>
    );
}