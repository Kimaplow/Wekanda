import axios from 'axios';
import config from '../config';

export async function fetchQuizz(id) {
    let q;
    await axios.get(`http://${config.server}/quizzes/${id}`)
        .then(async res => {
            q = res.data;
            if(q.path_file !== ''){
                await axios.get(`http://${config.server}/img/${q.path_file}`)
                           .then(result => {
                                q.file = result;
                            });
            }
        });
    return q;
}

export async function fetchFile(filename){
    let f;
    let directory = filename.includes('jpg') || filename.includes('jpeg') ? 'img' : 'video';
    await axios.get(`http://${config.server}/${directory}/${filename}`)
               .then(res => {
                   f = res;
               });
    return f;
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

export async function fetchScoreMax(id) {
    let s;
    await axios.get(`http://${config.server}/scores/${id}/quizz/max`)
        .then(res => {
            s = (res.data);
        });
    return s;
}

export async function fetchUser(id) {
    let j;
    await axios.get(`http://${config.server}/users/${id}`)
        .then(res => {
            j = (res.data);
        });
    return j;
}
