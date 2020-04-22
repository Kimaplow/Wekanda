import React from 'react';
import './css/signup.css';

export default function Signup(){
    return(
        <div id='signup-container'>

            <div id={"up_log_pseudo"}>
                <label htmlFor={"pseudo"}>Pseudo : </label>
                <input type="text" name={"pseudo"}/>
            </div>

            <div id={"up_log_mail"}>
                <label htmlFor={"mail"}>Mail : </label>
                <input type="text" name={"mail"}/>
            </div>

            <div id={"up_log_mdp"}>
                <label htmlFor={"mdp"}>Mot de passe : </label>
                <input type="text" name={"mdp"}/>
            </div>

            <div id={"log_mdp_confirmation"}>
                <label htmlFor={"mdp_conf"}>Confirmation mot de passe : </label>
                <input type="text" name={"mdp_conf"}/>
            </div>

            <input id={"inscription"} type="submit" value="S'inscrire"/>

        </div>
    );
}