import React from 'react';
import './css/signup.css';
import { TextInput, Button } from "react-materialize";
import { signUp } from "../APIcalls/APIpost";
import { useHistory } from "react-router-dom";

export default function Signup() {
    const history = useHistory();

    async function onSubmit(e) {
        e.preventDefault();
        const pseudo = e.target.pseudo.value;
        const mail = e.target.email.value;
        const password = e.target.password.value;
        const fullfiled = await signUp(pseudo, mail, password);
        if (!fullfiled || !(pseudo && mail && password)) {
            alert("Erreur lors de l'inscription");
        } else {
            alert('Votre compte a bien été créée');
            history.push('/signin');
        }
    }

    return (
        <div>
            <h1>S'inscrire</h1>
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
                </div>
            </div>
        </div>
    );
}