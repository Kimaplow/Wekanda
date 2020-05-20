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
    await axios.get(`http://${config.server}/quizzes/${id}/questions`)
        .then(res => {
            return (res.data);
        });
}
export async function fetchAllTags() {
    await axios.get(`http://${config.server}/tags`)
        .then(res => {
            return (res.data);
        });
}
export async function fetchAnswersOfQuestion(id) {
    await axios.get(`http://${config.server}/questions/${id}/answers`)
        .then(res => {
            return (res.data);
        });
}
export async function fetchTagsOfQuizz(id) {
    await axios.get(`http://${config.server}/quizzes/${id}/tags`)
        .then(res => {
            return (res.data);
        });
}