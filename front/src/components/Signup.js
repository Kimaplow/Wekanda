import React, { useState } from 'react';
import './css/signup.css';
import { TextInput, Button, CardPanel, Icon } from "react-materialize";
import { signUp } from "../APIcalls/APIpost";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import sleep from "../tools/sleep";


export default function Signup() {
    const history = useHistory();
    const [alert, setAlert] = useState();

    async function onSubmit(e) {
        e.preventDefault();
        const pseudo = e.target.pseudo.value;
        const mail = e.target.email.value;
        const password = e.target.password.value;
        if(!(pseudo && mail && password)) {
            return setAlert(<CardPanel className="orange"><Icon tiny>error</Icon> Un ou plusieurs champs n'a pas été rempli</CardPanel>);
        }
        const fullfiled = await signUp(pseudo, mail, password); 
        console.log(fullfiled)
        if (!fullfiled) {
            setAlert(<CardPanel className="orange"><Icon tiny>error</Icon> Erreur lors de l'inscription</CardPanel>);
        } else {
            setAlert(<CardPanel className="green"><Icon tiny>check</Icon> Inscription réussie</CardPanel>);
            await sleep(1000);
            history.push('/signin');
        }
    }

    return (
        <div>
            <h1>S'inscrire</h1>
            <span id="alert-box">
                {alert}
            </span>
            <div id="signup-container">
                <div id="form-container">
                    <form onSubmit={e => onSubmit(e)}>
                        <TextInput
                            id="pseudo"
                            label="Pseudo"
                        />
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
                        <Button>S'inscrire </Button>
                    </form>
                    <p>Déjà un compte ? <Link to="/signin">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
}