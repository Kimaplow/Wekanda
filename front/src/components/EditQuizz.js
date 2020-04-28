import { useParams } from 'react-router-dom';
import React, { useEffect, useState, Redirect } from 'react';
import axios from 'axios';
import config from '../config';
import { Select } from 'react-materialize';
import './css/editQuizz.css';

export default function EditQuizz() {
   

    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then((res) => {
                setQuizz(res.data[0]);
            });
    }

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

    async function editQuizz(event){

        let title = event.target.title.value;
        let file;
        let difficulty = event.target.select.value;
        let fileName;

        if(fileName !== ''){
            fileName = uniqueName(event.target.fileName.value);
        }

        if(event.target.file.files[0]){
            file = event.target.file.files[0];
        }
        else{
            file = '';
        }

        let data = new FormData();
        data.append('title', title);
        data.append('path_file', fileName);
        data.append('difficulty', difficulty);
        //console.log(data);
        //alert(id_quizz + ' // ' + title + ' // ' + fileName + ' // ' + file + ' // ' + difficulty);
        await axios.patch(`http://${config.server}/quizzes/${id_quizz}`, data);
    }

    useEffect(() => {
        getQuizz();
    }, [])

    return (
        <div id='edit-quizz-container'>

            <h3>{quizz.title}</h3>

            <form onSubmit={event => editQuizz(event)}>

                <div class="col s12">
                    <span style = {{fontSize: '22px'}}>Title :</span>
                    <div class="input-field inline">
                        <input style = {{fontSize: '22px'}} id="title" type="text" class="validate" placeholder={quizz.title}/>
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
                <button class="waves-effect waves-light btn-large" type="submit">Confirmer</button>
                </div>

            </form>

        </div>
    );
}