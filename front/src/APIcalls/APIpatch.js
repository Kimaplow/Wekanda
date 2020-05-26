import axios from 'axios';
import config from '../config';

export async function updateQuizz(q){
    console.log('dans le patch');
    console.log(q);
    const bodyFormData = new FormData();
    bodyFormData.set('title', q.title);
    bodyFormData.set('path_file', q.path_file);
    bodyFormData.set('difficulty', q.difficulty);
    console.log(bodyFormData);
    await axios.patch(`http://${config.server}/quizzes/${q.id_quizz}`, bodyFormData);
}

export async function updateQuestion(q){
    const bodyFormData = new FormData();
    bodyFormData.set('question', q.question);
    bodyFormData.set('path_file', q.path_file);
    await axios.patch(`http://${config.server}/questions/${q.id_question}`, bodyFormData);
}

export async function updateAnswer(a){
    const bodyFormData = new FormData();
    bodyFormData.set('answer', a.answer);
    bodyFormData.set('correct', a.correct);

}
