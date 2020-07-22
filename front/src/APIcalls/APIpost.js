import axios from 'axios';
import config from '../config';

export async function sendQuizz(q) {

    const bodyFormData = new FormData();
    if (q.id_creator) {
        bodyFormData.set('id_creator', q.id_creator);
    }
    bodyFormData.set('title', q.title);
    bodyFormData.set('difficulty', q.difficulty);
    bodyFormData.set('path_file', q.path_file);
    bodyFormData.set('description', q.description);
    if (q.file){
        bodyFormData.append('file', q.file);
    }
    const res = await axios.post(`http://${config.server}/quizzes/`, bodyFormData);
    return(res.data.id_quizz);
}

export async function sendQuestion(q) {
    const bodyFormData = new FormData();
    bodyFormData.set('id_quizz', q.id_quizz);
    bodyFormData.set('question', q.question);
    bodyFormData.set('path_file', q.path_file);
    if (q.file){
        bodyFormData.append('file', q.file);
    }
    await axios.post(`http://${config.server}/questions`, bodyFormData);
}

export async function sendAnswer(a) {
    const bodyFormData = new FormData();
    bodyFormData.set('path_file', a.path_file);
    bodyFormData.set('answer', a.answer);
    bodyFormData.set('correct', a.correct);
    if (a.file){
        bodyFormData.append('file', a.file);
    }
    await axios.post(`http://${config.server}/answers`, bodyFormData);
}

export async function sendTagQuizz(t, id) {
    const bodyFormData = new FormData();
    bodyFormData.set('id_quizz', id);
    bodyFormData.set('tag', t);

    await axios.post(`http://${config.server}/tagsquizzes`, bodyFormData);
}
export async function sendNewTag(t) {
    const bodyFormData = new FormData();
    bodyFormData.set('tag', t)
    axios.post(`http://${config.server}/tags`, bodyFormData);
}

export async function signUp(pseudo,mail,password) {   
   const res = await axios.post(`http://${config.server}/users/signup`, {
       pseudo: pseudo,
       mail:mail,
       password:password
   }).catch(() => {
       console.error('SignUp Problem');
   });
   return res !== undefined;
}

export async function signIn(mail,password) {
    console.log(mail,password);
    const res = await axios.post(`http://${config.server}/users/login`, {
       mail:mail,
       password:password
   }).catch(() => {
        console.error('SignIn Problem');
   });
   return res ? res.data : undefined;
}