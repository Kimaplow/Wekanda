import React from 'react';
import './css/header.css';

export default function Header(){

    return(
        <div id="header-container">

            <div>
                    <h1 id={"title"}>Wekanda</h1>
            </div>
            

            <div id="header-right">

                <input className="right-item" type="text" />

                <a className="right-item" href="#f"><img src={"/filtre.png"} alt={"icon_filtre"}/></a>

                <a className="right-item" href="#p"><img src={"/icon_profil.png"} alt={"icon_profil"}/></a>

            </div>
        </div>
    );
}
