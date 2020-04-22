import React from 'react';
import './css/header.css';

export default function Header(){

    return(
        <div id="header-container">

            <div>
                <a href="#" id="title">
                    <h1>Wekanda</h1>
                </a>
            </div>
            

            <div id="header-right">

                <input className="right-item" type="text" />

                <a className="right-item" href="#f"><img src={"/filtre.png"}/></a>

                <a className="right-item" href="#p"><img src={"/icon_profil.png"}/></a>

            </div>
        </div>
    );
}
