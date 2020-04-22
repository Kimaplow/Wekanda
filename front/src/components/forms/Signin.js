import React from 'react';
import './css/signin.css';

export default function Signin(){
    return(
        <div id='signin-container'>

            <div id={"log_pseudo"}>
                <label for={"pseudo"}>Pseudo : </label>
                <input type="text" name={"pseudo"}/>
            </div>

            <div id={"log_mdp"}>
                <label for={"mdp"}>Mot de passe : </label>
                <input type="text" name={"mdp"}/>
            </div>

            <input id={"connexion"} type="submit" value="Connexion"/>
            
        </div>
    );
}