import React from 'react';
//import './css/quizz.css'
import {Link} from "react-router-dom";


export default function Quizz(props) {
    //const keywords = props.keywords.split(';');
    //const listKeywords = keywords.map((kw) => <li>{kw}</li>);
    return(
        <div className='quizz'>
            <h1>{props.title}</h1>
            <img src={props.img} width={500} height={400}/>
            <br/>
            {/*<ul className={"keyword"}>{listKeywords}</ul>*/}
            <br/>
            <Link className={"button"} to={`/quizz/${props.id_quizz}`}>JOUER</Link>
        </div>
    )
}

