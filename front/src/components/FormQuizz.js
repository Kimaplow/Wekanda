import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { Select, Chip, Icon, TextInput } from 'react-materialize';
import './css/formQuizz.css';

export default function FormQuizz(props) {

    // Mode ADD
    const { id_user } = useParams();

    // Mode EDIT
    const { id_quizz } = useParams();
    const [quizz, setQuizz] = useState({});
    const [edit, setEdit] = useState(false);

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then((res) => {              
                setQuizz(res.data[0]);
            });
    }

    useEffect(() => {
        if(id_quizz !== undefined){
            setEdit(true);
            getQuizz();
        }
    }, [])

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

    async function sendResquest(event){
        event.preventDefault();

        let title = event.target.title.value;
        let pathFile = '';
        let file = null;
        let difficulty = event.target.difficulty.value;
        let description = event.target.description.value;
        let tags = [];

        if(event.target.difficulty.value !== ''){
            difficulty = event.target.difficulty.value;
        }

        if(!edit && title === ''){
            return alert("Entrez un titre 'il vous plait !")
        }

        if(difficulty === ''){
            return alert("Choississez une difficulté s'il vous plait !")
        }
        
        if(document.getElementById("file").files[0]){
            console.log('FILE COND')
            file = document.getElementById("file").files[0];
            console.log(file)
            pathFile = uniqueName(file.name);
        }

        let tabTags = document.getElementById("tags").M_Chips.chipsData;
        if(tabTags.length > 0){
            tabTags.forEach(
                elt => tags.push(elt.tag)
            )
        }
        else{
            return alert("Entrez au moins un tag s'il vous plait !");
        }
        
        let bodyFormData = new FormData();
        if(!edit){
            bodyFormData.set('id_creator', id_user);
        }
        bodyFormData.set('title', title);
        bodyFormData.set('path_file', pathFile);
        bodyFormData.set('difficulty', difficulty);
        bodyFormData.set('description', description);
        //bodyFormData.set('tags', tags);
        bodyFormData.append('file', file);

        if(edit){
            await axios.patch(`http://${config.server}/quizzes/${id_quizz}`, bodyFormData);
            window.location.reload();
        }
        else{
            await axios.post(`http://${config.server}/quizzes/`, bodyFormData);
            window.location=`/profile/${id_user}`;
        }
    }
    
    return (
        <div id='form-quizz-container'>

            {quizz ? <h3>{quizz.title}</h3>: false}

            <form onSubmit={event => sendResquest(event)} encType="multipart/form-data">

                <div id="div-title" className="col s12">
                    <div className="input-field inline">
                        <TextInput
                            id="title"
                            label='Title'
                            placeholder={edit ? quizz.title : undefined}
                        />
                    </div>
                </div>

                <div id="div-file" className="col s12">
                    <div className="input-field inline">
                        <TextInput
                            id="file"
                            label="File"
                            type="file"
                            name="file"
                        />
                    </div>
                </div>

                <div id="div-difficulty" className="col s12">
                    <div className="input-field inline" >
                        <Select defaultValue='' id="difficulty">
                            <option value="" disabled >Choose a difficulty</option>
                            <option value="1">Facile</option>
                            <option value="2">Moyen</option>
                            <option value="3">Difficile</option>
                        </Select>
                    </div>
                </div>

                <div id="div-description" className='col s12'>
                    <div className='input-field inline'>
                        <TextInput
                            data-length={140}
                            id="description"
                            label="Description"
                            placeholder={edit ? quizz.description : undefined}
                        />
                    </div>
                </div>

                <div id="div-tags" className="col s12">
                    <div className="input-field inline">
                        <Chip
                            id="tags"
                            close={false}
                            closeIcon={<Icon className="close">close</Icon>}
                            options={{
                                autocompleteOptions: {
                                    data: {
                                        Apple: null,
                                        Google: null,
                                        Microsoft: null
                                    },
                                    limit: Infinity,
                                    minLength: 3,
                                    onAutocomplete: function noRefCheck() { }
                                },
                                placeholder: 'Enter a tag',
                                secondaryPlaceholder: '+Tag'
                            }}
                        />
                    </div>
                </div>

                <div id="div-confirmer" className="col s12">
                    <button className="waves-effect waves-light btn-large" type="submit" name="action">Confirmer</button>
                </div>

            </form>

            {edit ?
                <div id="div-questions" className="questions">
                    <a href={`/questions/${id_quizz}/edit`} className="waves-effect waves-light btn-large">Modifier les questions</a>
                </div>
                : false
            }

        </div>
    );
}