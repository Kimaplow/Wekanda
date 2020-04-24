import React from 'react';
import config from '../../config';
import './css/quizzcard.css';

export default function QuizzCard(props){
    
    QuizzCard.defaultProps = {
        width: 500
    }
    
    let height = 0.30*props.width;
    console.log(height);
    return(
        <div id='card-container' style = {{
            maxWidth: `${props.width}px`,
            height: `${height}px`,
        }}>
            <img src={`http://${config.server}/img/${props.quizz.path_file}`} 
                 className='card-item'></img>

            <div id='card-text' className='card-item'>
                <h2 id='quizz-title'>{props.quizz.title}</h2>
                {/* <h3>{props.quizz.description}</h3> */}
            </div>
            
        </div>
    );
}