import React from "react";
import config from '../config'
import ReactPlayer from 'react-player'

export default function PlayQuestion(props){
    return (
        <div id='question'>
            {props.src !== '' ? 
                    <ReactPlayer 
                        id='player' 
                        controls={true}
                        volume={0.5}
                        wrapper='question'
                        url={`http://${config.server}/video/${props.src}`}/> : ''}
            <h2>{props.question}</h2>
        </div>
    );
}