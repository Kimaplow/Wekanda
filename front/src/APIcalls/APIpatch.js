import axios from 'axios';
import config from '../config';

export async function updateQuizz(q){
    console.log('dans le patch '+ `http://${config.server}/quizzes/${q.id_quizz}`);
    console.log(q);
    console.log(q.file)
    const bodyFormData = new FormData();
    bodyFormData.set('title', q.title);
    bodyFormData.set('path_file', q.path_file);
    bodyFormData.set('difficulty', q.difficulty);
    if (q.file){
        bodyFormData.append('file', q.file);
    }
    for (var pair of bodyFormData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    await axios.patch(`http://${config.server}/quizzes/${q.id_quizz}`, bodyFormData);
}

export async function updateQuestion(q){
    const bodyFormData = new FormData();
    // console.log(q)
    bodyFormData.set('question', q.question);
    bodyFormData.set('path_file', q.path_file);
    if (q.file){
        bodyFormData.append('file', q.file);
    }
    // console.log('patching questiooon')
    for (var pair of bodyFormData.entries()) {
        // console.log(pair[0]+ ', ' + pair[1]); 
    }
    await axios.patch(`http://${config.server}/questions/${q.id_question}`, bodyFormData);
}

export async function updateAnswer(a){
    const bodyFormData = new FormData();
    bodyFormData.set('answer', a.answer);
    bodyFormData.set('correct', a.correct);
    bodyFormData.set('path_file', a.path_file);
    if (a.file){
        bodyFormData.append('file', a.file);
    }
    for (var pair of bodyFormData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    console.log(`http://${config.server}/answers/${a.id_answer}`)
    await axios.patch(`http://${config.server}/answers/${a.id_answer}`, bodyFormData);

}
