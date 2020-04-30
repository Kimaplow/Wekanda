import React from 'react';
import config from '../config';



export default function QuizzCard(props) {

    QuizzCard.defaultProps = {
        width: 500
    }

    let height = 0.30 * props.width;
    return (

        <div className="col s12 m7" style = {{maxWidth: `${props.width}px`,height: `${height}px`,
         marginBottom: '5%', marginLeft: '1%'}}>
            <h4 className="header" style={{marginTop: '10%'}}>{props.quizz.title}</h4>
            <div className="card horizontal" >
                <div className="card-image"  >
                    <img style = {{height: `${height}px`, width: '150px'}} src={`http://${config.server}/img/${props.quizz.path_file}`} alt={`${props.quizz.path_file}`}/>
                </div>
                <div className="card-stacked">
                    <div className="card-content" style = {{color : '#3D3D3E'}}>
                        <p>I am a very simple card. I am good at containing small bits of information.</p>
                    </div>
                    <div className="card-action">
                        <a href={`/quizz/${props.quizz.id_quizz}/play`}>Jouer</a>
                        <a href={`/quizz/${props.quizz.id_quizz}/edit`} style = {{marginLeft : '150px'}}>Modifier</a>
                    </div>
                </div>
            </div>
        </div>

    );
}