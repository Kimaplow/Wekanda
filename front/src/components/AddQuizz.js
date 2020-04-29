import { useParams } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import config from '../config';
import { Select } from 'react-materialize';
import './css/addQuizz.css';

export default function EditQuizz() {
   

    const { id_user } = useParams();
    const id_creator = id_user;

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
        bodyFormData.append('file', file);

        await axios.post(`http://${config.server}/quizzes/`, bodyFormData);
        window.location.reload();
    }

    return (
        <div id='edit-quizz-container'>

            {/* Si on enlève le h3, la prochaine div n'est pas centrée */}
            <h3></h3>

            <form onSubmit={event => addQuizz(event)} enctype="multipart/form-data">

                <div class="col s12">
                    <span style = {{fontSize: '22px'}}>Title :</span>
                    <div class="input-field inline">
                        <input style = {{fontSize: '22px'}} id="title" type="text" class="validate" placeholder={'Example'}/>
                    </div>
                </div>

                <div class="col s12">
                    <div class="input-field inline">
                        <div class="file-field input-field">
                            <div class="btn">
                                <span>File</span>
                                <input id ="file" type="file" />
                            </div>
                            <div class="file-path-wrapper">
                                <input id="fileName" class="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col s12">
                    <div class="input-field inline" >       
                        
                        <Select id="select">
                            <option value="" disabled selected >Difficulty</option>
                            <option value="1">Facile</option>
                            <option value="2">Moyen</option>
                            <option value="3">Difficile</option>
                        </Select>
                    </div>
                </div>

                <div class="col s12">
                    <button class="waves-effect waves-light btn-large" type="submit" name="action">Confirmer</button>
                </div>

            </form>

        </div>
    );
}