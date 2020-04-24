import React from 'react';
//import './css/quizz.css'
import { Link } from "react-router-dom";


export default function Quizz(props) {
    let listTags = [];
    if (props.tags !== null) {
        const tags = props.tags.split(',');
        listTags = tags.map((kw) => <li>{kw}</li>);
    }
    return (
        <div className='quizz'>
            <h3>{props.title}</h3>
            <img src={props.img} width={500} height={400} />
            <br />
            <ul className={"tags"}>{listTags}</ul>
            <br />
            <Link className={"button"} to={`/quizz/${props.id_quizz}`}>JOUER</Link>
        </div>
    )
}

