import React from 'react';
import './css/signin.css';
import { TextInput, Button } from "react-materialize";
import {Link} from "react-router-dom";
async function onSubmit(e) {

}

export default function Signin() {
    return (
        <div>
            <h1>Se connecter</h1>
            <div id='signin-container'>
            <div id="form-container">
                    <form onSubmit={e => onSubmit(e)}>
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