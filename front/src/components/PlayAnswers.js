import React from "react";

export default function PlayAnswers(props) {

    return(
        <div id='answers'>
            {props.answers.map((a, idx) =>{
                return(
                    <div className='answer'
                         id={'answer'+idx}
                         key={idx}
                        //  onClick={e => {props.click(a)}}
                    >
                        <h2>{a.answer}</h2>
                        {a.correct ? 
                            <i className='material-icons'>check</i> : 
                            <i className='material-icons'>clear</i>
                        }
                    </div>
                )
            })        
            }
        </div>
    );
}