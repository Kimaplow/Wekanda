import React, { useEffect, useState } from 'react';
import './css/signin.css';
import { TextInput, Button, CardPanel, Card, Icon } from "react-materialize";
import { Link } from "react-router-dom";
import { signIn } from "../APIcalls/APIpost";
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";
import sleep from "../tools/sleep";

export default function Signin() {

    const [cookie, setCookie] = useCookies(['login']);
    const history = useHistory();
    const [alert, setAlert] = useState();
    



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
            history.push('/home');
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