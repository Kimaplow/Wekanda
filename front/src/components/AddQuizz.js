import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Select } from 'react-materialize';
import './css/editQuizz.css';

export default function EditQuizz() {
   

    const { id_user } = useParams();

    console.log(id_user);

    return (
        <div id='edit-quizz-container'>

            {/* Si on enlève le h3, la prochaine div n'est pas centrée */}
            <h3></h3>

            <form>

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
                                <input type="file" />
                            </div>
                            <div class="file-path-wrapper">
                                <input class="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col s12">
                    <div class="input-field inline" >       
                        
                        <Select >
                            <option value="" disabled selected >Difficulty</option>
                            <option value="1">Facile</option>
                            <option value="2">Moyen</option>
                            <option value="3">Difficile</option>
                        </Select>
                    </div>
                </div>

                <div class="col s12">
                <a class="waves-effect waves-light btn-large">Confirmer</a>
                </div>

            </form>

        </div>
    );
}