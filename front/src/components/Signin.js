import React, { useEffect, useState } from 'react';
import './css/signin.css';
import { TextInput, Button, CardPanel, Card, Icon } from "react-materialize";
import { Link, useHistory } from "react-router-dom";
import { signIn } from "../APIcalls/APIpost";
import { useCookies } from 'react-cookie';
import sleep from "../tools/sleep";
import axios from "axios";
import config from "../config";

export default function Signin() {

    const [cookie, setCookie] = useCookies(['login']);
    const history = useHistory();
    const [alert, setAlert] = useState();
    
    function redirectBack() {
        if(!document.referrer) {
            history.push('/home')
        } else {
            history.goBack();
        }
    }

    async function verifyToken() {
        axios.defaults.headers.common['Authorization'] = (cookie.login ? 'Bearer ' + cookie.login.token : null);
        await axios.get(`http://${config.server}/users/verify_token`, { responseType: 'text'})
        .then(() => redirectBack())
        .catch();
    }

    useEffect(() => {
        verifyToken();
    },[])


    async function onSubmit(e) {
        e.preventDefault();
        const user = { mail: e.target.email.value};
        const password = e.target.password.value;
        const token = await signIn(user.mail, password);
        if(!(user.mail && password)) {
            setAlert(<CardPanel className="orange"><Icon tiny>error</Icon> Un ou plusieurs champs n'a pas été rempli</CardPanel>);
        } else if (!token) {
            setAlert(<CardPanel className="red"><Icon tiny>error</Icon> Identifiants Incorrect</CardPanel>);
            document.querySelector("#login-form").reset();
        } else {
            user.token = token;
            setCookie('login', user, {path:'/'});
            setAlert(<CardPanel className="green"><Icon tiny>check</Icon> Connexion réussie</CardPanel>);
            await sleep(500);
            redirectBack();
        }
    }

    return (
        <div>
            <h1>Se connecter</h1>
            <span id="alert-box">
                {alert}
            </span>
            <div id="signin-container">
                <div id="form-container">
                    <form onSubmit={e => onSubmit(e)} id="login-form">
                        <TextInput
                            id="email"
                            label="Email"
                            email
                            validate
                        />
                        <TextInput
                            id="password"
                            label="Password"
                            password
                        />
                        <Button>Se connecter</Button>
                    </form>
                    <p>Pas de compte ? <Link to="/signup">S'inscrire</Link></p>
                </div>
            </div>
        </div>
    );
}