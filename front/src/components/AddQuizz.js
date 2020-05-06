import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { Select } from 'react-materialize';
import './css/addQuizz.css';

export default function EditQuizz() {
   

    const { id_user } = useParams();
    const id_creator = id_user;
    const [charsLeft, setCharsLeft] = useState(140);
    const [description, setDescription] = useState('');
    function uniqueName(filename) {
        if(filename){
            const index = filename.indexOf(".");
            const rootFilename = filename.substr(0, index);
            return rootFilename + Date.now() + filename.substr(index);
        }
        else{
            return '';
        }
    }

    async function addQuizz(event){

        event.preventDefault();
        let title = event.target.title.value;
        let difficulty = event.target.select.value;

        let file;      
        let fileName;

        if(event.target.file.files[0]){
            file = event.target.file.files[0];
        }
        else{
            file = '';
        }

        if(fileName !== ''){
            fileName = uniqueName(event.target.fileName.value);
        }
        
        const bodyFormData = new FormData();
        bodyFormData.set('id_creator', id_creator);
        bodyFormData.set('title', title);
        bodyFormData.set('difficulty', difficulty);
        bodyFormData.set('path_file', fileName);
        bodyFormData.set('description', description);
        bodyFormData.append('file', file);

        await axios.post(`http://${config.server}/quizzes/`, bodyFormData);
        // window.location=`/profile/${id_creator}`;
    }

    function handleChange(event){
        /* Update le compteur de caracteres */
        const charCount = event.target.value.length;
        const tmpLeft = 140- charCount;
        if(tmpLeft == 0){
            
        }
        setCharsLeft(tmpLeft);
        setDescription(event.target.value);
    };

    useEffect(()=> {

    }, [charsLeft]);

    return (
        <div id='add-quizz-container'>

            {/* Si on enlève le h3, la prochaine div n'est pas centrée */}
            <h3></h3>

            <form onSubmit={event => addQuizz(event)} encType="multipart/form-data">

                <div className="col s12">
                    <div className="input-field inline">
                        <label htmlFor='title'>Title</label>
                        <input style = {{fontSize: '22px'}} id="title" type="text" className="validate" placeholder={'Example'}/>
                    </div>
                </div>

                <div className="col s12">
                    <div className="input-field inline">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input id ="file" type="file" />
                            </div>
                            <div className="file-path-wrapper">
                                <input id="fileName" className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col s12">
                    <div className="input-field inline" >       
                        <label htmlFor='difficulty'>Difficulty</label>
                        <Select defaultValue= '' id="difficulty">
                            <option value="" disabled >Choose a difficulty</option>
                            <option value="1">Facile</option>
                            <option value="2">Moyen</option>
                            <option value="3">Difficile</option>
                        </Select>
                    </div>
                </div>

                <div className='col s12'>
                    <div className='input-field inline'>
                        <textarea id="description"  
                                  className="materialize-textarea" 
                                  maxLength='140'
                                  onChange={e => {handleChange(e)}} 
                                  placeholder={'My Quizz is super duper teachful!'}
                        />
                        <label htmlFor='description'>Description</label>
                        <p id='charCounter'>{charsLeft}</p>
                    </div>
                </div>

                <div className="col s12">
                    <button className="waves-effect waves-light btn-large" type="submit" name="action">Confirmer</button>
                </div>

            </form>

        </div>
    );
}