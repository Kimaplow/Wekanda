import React from 'react';
import config from '../config';
import './css/quizzcard.css';



export default function QuizzCard(props) {

    QuizzCard.defaultProps = {
        width: 500
    }

    let height = 0.30 * props.width;
    return (

        <div className="col s12 m7" style = {{maxWidth: `${props.width}px`,height: `${height}px`,
         marginBottom: '5%', marginLeft: '1%'}}>
            <h4 className="header">{props.quizz.title}</h4>
            <div className="card horizontal" >
                <div className="card-image"  >
                    <img style = {{height: `${height}px`, width: '150px'}} src={`http://${config.server}/img/${props.quizz.path_file}`} alt={`${props.quizz.path_file}`}/>
                </div>
                <div className="card-stacked">
                    <div className="card-content">
                        <p id='desc'>{props.quizz.description}</p>
                    </div>
                    <div className="card-action">
                        <a href={`/quizz/${props.quizz.id_quizz}/play`}>Jouer</a>
                        <a id='modify-quizz-button' href={`/quizz/${props.quizz.id_quizz}/edit`}>Modifier</a>
                    </div>
                </div>
            </div>
        </div>

    );
}