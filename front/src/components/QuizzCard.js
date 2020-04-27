import React from 'react';
import config from '../config';
import './css/materialize.css';


export default function QuizzCard(props) {

    QuizzCard.defaultProps = {
        width: 500
    }

    let height = 0.30 * props.width;
    console.log(height);
    return (

        <div class="col s12 m7" style = {{maxWidth: `${props.width}px`,height: `${height}px`}}>
            <h4 class="header">{props.quizz.title}</h4>
            <div class="card horizontal" >
                <div class="card-image"  >
                    <img style = {{height: `${height}px`, width: '150px'}} src={`http://${config.server}/img/${props.quizz.path_file}`} />
                </div>
                <div class="card-stacked">
                    <div class="card-content" style = {{color : '#3D3D3E'}}>
                        <p>I am a very simple card. I am good at containing small bits of information.</p>
                    </div>
                    <div class="card-action">
                        <a href="#">Jouer</a>
                        <a href={`/quizz/${props.quizz.id_quizz}/edit`} style = {{marginLeft : '150px'}}>Modifier</a>
                    </div>
                </div>
            </div>
        </div>

    );
}