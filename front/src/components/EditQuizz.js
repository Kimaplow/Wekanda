import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './css/editQuizz.css';
import './css/materialize.css';

export default function EditQuizz() {
   

    const { id_quizz } = useParams();
    console.log(id_quizz);

    const [quizz, setQuizz] = useState({});

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then((res) => {
                setQuizz(res.data[0]);
            });
    }

    useEffect(() => {
        getQuizz();
    }, [])

    return (
        <div id='edit-quizz-container'>

            <h3>{quizz.title}</h3>

            <form>

                <div class="col s12">
                    Title :
                    <div class="input-field inline">
                        <input style = {{color : 'white'}} id="title" type="email" class="validate" placeholder={quizz.title}/>
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

                <div class="input-field col s12">
                    <select>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label>Materialize Select</label>
                </div>

            </form>

        </div>
    );
}