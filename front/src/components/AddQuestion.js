import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './css/addQuestion.css';

export default function AddQuestion(props) {

    function onSubmit(e){
        e.preventDefault();
        let res = {
            question: e.question.value,
            answers: [
                e.answer0.value,
                e.answer1.value,
                e.answer2.value,
                e.answer3.value
            ],
            path_file: e.path_file.value
        }

        props.onSubmitQuestion(res)
    }

    useEffect(() => {

    }, [])



    return (
        <div id="add-questions-container">

            <form onSubmit={e => onSubmit(e)} encType="multipart/form-data">

                <div className="col s12">
                    <label htmlFor='question'>Question</label>
                    <input id="question" onChange={e => {props.onChange()}} defaultValue={props.question ? props.question.question : ''} placeholder={'Quelle est la difference entre un hibou et une corde ?'}  type="text" className="validate itest" />
                </div>
                <div className="col s12">
                    <label htmlFor='answer0'>Answer 1</label>
                    <input id='answer0' onChange={e => {props.onChange()}} defaultValue={props.answers ? props.answers[0].answer : ''} placeholder={'Reponse A'}  type="text" className="validate itest" />
                </div>
                <div className="col s12">
                    <label htmlFor='answer1'>Answer 2</label>
                    <input id='answer1' onChange={e => {props.onChange()}} defaultValue={props.answers ? props.answers[1].answer : ''} placeholder={'Reponse B'}  type="text" className="validate itest" />
                </div>
                <div className="col s12">
                    <label htmlFor='answer2'>Answer 3</label>
                    <input id='answer2' onChange={e => {props.onChange()}} defaultValue={props.answers ? props.answers[2].answer : ''} placeholder={'Reponse C'}  type="text" className="validate itest" />
                </div>
                <div className="col s12">
                    <label htmlFor='answer3'>Answer 4</label>
                    <input id='answer3' onChange={e => {props.onChange()}} defaultValue={props.answers ? props.answers[3].answer : ''} placeholder={'Reponse D'}  type="text" className="validate itest" />
                </div>
            </form>

        </div>
    );
}