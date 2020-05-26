import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { Select, Chip, Icon } from 'react-materialize';
import './css/addQuizz.css';




export default function AddQuizz(props) {
    const { id_user } = useParams();
    const id_creator = id_user;
    const [charsLeft, setCharsLeft] = useState(140);
    const option1 = 1;
    const option2 = 2;
    const option3 = 3;
    function uniqueName(filename) {
        if (filename) {
            const index = filename.indexOf(".");
            const rootFilename = filename.substr(0, index);
            return rootFilename + Date.now() + filename.substr(index);
        }
        else {
            return '';
        }
    }

    function onSubmit(event) {
        event.preventDefault();
        // let file;
        // event.target.file.files[0] ? file = event.target.file.files[0] : file = 0;

        // il faut récupérer les tags mis au quizz
        //let tags = $('#tags').material_chip('data');
        let fileName = event.target.fileName.value;
        if (fileName) fileName = uniqueName(fileName); else fileName = '';
        const quizz = {
            title: event.target.title.value,
            difficulty: event.target.difficulty.value,
            fileName: fileName,
            description: event.target.description.value,
        };
        // props.onSubmitQuizz(quizz)
        // console.log(event.target);
        // console.log({
        //     title: event.target.title.value,
        //     difficulty: event.target.difficulty.value,
        //     fileName: fileName,
        //     description: event.target.description.value,
        // });
    }

    function handleCounter(event) {
        /* Update le compteur de caracteres */
        const charCount = event.target.value.length;
        const tmpLeft = 140 - charCount;
        if (tmpLeft === 0) {

        }
        setCharsLeft(tmpLeft);
        props.onChange();
    };

    useEffect(() => {}, [charsLeft]);
    return (
        <div id='add-quizz-container'>

            <form onSubmit={event => {
                event.preventDefault();
                props.onSubmitQuizz({
                    title: event.target.title.value,
                    difficulty: event.target.difficulty.value,
                    fileName: event.target.fileName.value,
                    description: event.target.description.value,
                }, 1);
            }} encType="multipart/form-data">

                <div className="col s12">
                    <button className="waves-effect waves-light btn-large"
                        type="submit">
                        <i className="material-icons">save</i>
                    </button>
                </div>

                <div id="div-title" className="col s12">
                    <div className="input-field inline">
                        <label htmlFor='title'>Title</label>
                        <input style={{ fontSize: '22px' }} onChange={e => { props.onChange() }} id="title" type="text" className="validate" defaultValue={props.quizz ? props.quizz.title : ''} placeholder={'Example'} />
                    </div>
                </div>

                <div className="col s12">
                    <div className="input-field inline">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input id="file" type="file" />
                            </div>
                            <div className="file-path-wrapper">
                                <input onChange={e => { props.onChange() }} id="fileName" className="file-path validate" type="text" defaultValue={props.quizz ? props.quizz.path_file : ''} />
                            </div>
                        </div>
                    </div>
                </div>
            {/* {props.quizz ? console.log(props.quizz) : ''} */}
                <div className="col s12">
                    <div className="input-field inline" >
                        <label id="label-diff" htmlFor='difficulty'>Difficulty</label>
                        <Select onChange={e => props.onChange()} id="difficulty" value={props.quizz ? props.quizz.difficulty : ''}>
                            <option value='' disabled>Choose a difficulty</option>
                            <option value={option1} >Facile</option>
                            <option value={option2} >Moyen</option>
                            <option value={option3} >Difficile</option>
                        </Select>
                    </div>
                </div>

                <div className='col s12'>
                    <div className='input-field inline'>
                        <textarea id="description"
                            defaultValue={props.quizz ? props.quizz.description : ''}
                            className="materialize-textarea"
                            maxLength='140'
                            onChange={e => { handleCounter(e) }}
                            placeholder={props.quizz ? '' : 'My Quizz is super duper teachful!'}

                        />
                        <label htmlFor='description'>Description</label>
                        <p id='charCounter'>{charsLeft}</p>
                    </div>
                </div>


                <div id="div-tags" className="col s12">
                    <div className="input-field inline">
                        <Chip
                            onChange={e => { props.onChange() }}
                            id="tags"
                            close={false}
                            closeIcon={<Icon className="close">close</Icon>}
                            options={{
                                //Il faut récupérer les tags ici
                                autocompleteOptions: {
                                    data: {
                                        Apple: null,
                                        Google: null,
                                        Microsoft: null
                                    },
                                    limit: Infinity,
                                    minLength: 3,
                                    onAutocomplete: function noRefCheck() { }
                                }
                            }}
                        />
                    </div>
                </div>



            </form>

        </div>
    );
}