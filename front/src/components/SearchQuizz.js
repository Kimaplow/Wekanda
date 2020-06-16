import React, {useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import config from "../config";
import QuizzCard from "./QuizzCard";

export default function SearchQuizz() {

    const { search } = useParams();
    const [quizzes, setQuizzes] = useState([]);

    async function getQuizzes(){
        axios.get(`http://${config.server}/quizzes/search/${search.toLowerCase()}`)
            .then(res => {
                setQuizzes(res.data);
            })
            .catch(err => console.log(err));
    }

    let quizzJSX = quizzes.map(function (q, index){
        return (<QuizzCard key={index} quizz={q} />);
    });

    useEffect(() => {
        getQuizzes() 
    },[search]);

    return (
        <div id="quizzes-filtered">
            <h1> Quizz ayant "{search}" dans leur titre :</h1>
            {quizzJSX}
        </div>
    );
}