import axios from 'axios';
import config from '../config';

export async function fetchQuizz(id) {
    let q;
    await axios.get(`http://${config.server}/quizzes/${id}`)
        .then(res => {
            q = res.data[0];
        });
    return q;
}
export async function fetchQuestionsOfQuizz(id) {
    let q;
    await axios.get(`http://${config.server}/quizzes/${id}/questions`)
        .then(res => {
            q = (res.data);
        });
    return q;
}
export async function fetchAllTags() {
    let t;
    await axios.get(`http://${config.server}/tags`)
        .then(res => {
            t = (res.data);
        });
    return t;
}
export async function fetchAnswersOfQuestion(id) {
    let a;
    await axios.get(`http://${config.server}/questions/${id}/answers`)
        .then(res => {
            a = (res.data);
        });
    return a;
}
export async function fetchTagsOfQuizz(id) {
    let t;
    await axios.get(`http://${config.server}/quizzes/${id}/tags`)
        .then(res => {
            t = (res.data);
        });
    return t;
}