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
        bodyFormData.set('title', title);
        bodyFormData.set('difficulty', difficulty);
        bodyFormData.set('path_file', fileName);
        bodyFormData.append('file', file);

        await axios.patch(`http://${config.server}/quizzes/${id_quizz}`, bodyFormData);
        window.location.reload();
    }

    useEffect(() => {
        getQuizz();
    }, [])

    return (
        <div id='edit-quizz-container'>

            <h3>{quizz.title}</h3>

            <form onSubmit={event => editQuizz(event)} enctype="multipart/form-data">

                <div className="col s12">
                    <span style = {{fontSize: '22px'}}>Title :</span>
                    <div className="input-field inline">
                        <input style = {{fontSize: '22px'}} id="title" type="text" className="validate" placeholder={quizz.title}/>
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
                        
                        <Select id="select">
                            <option value="" disabled selected >Difficulty</option>
                            <option value="1">Facile</option>
                            <option value="2">Moyen</option>
                            <option value="3">Difficile</option>
                        </Select>
                    </div>
                </div>

                <div className="col s12">
                <button className="waves-effect waves-light btn-large" type="submit">Confirmer</button>
                </div>

            </form>

        </div>
    );
}