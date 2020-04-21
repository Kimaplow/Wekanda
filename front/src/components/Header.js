import React from 'react';
import './css/header.css';

export default function Header(){

    return(
        <div className="header">

            <a href="#" className="logo">Wekanda</a>

            <div className="header-right">

                <input className={"search"} type="text" />

                <a className={"filter"} href="#f"><img src={"/filtre.png"}/></a>

                <a className={"profil"} href="#p"><img src={"/icon_profil.png"}/></a>

            </div>
        </div>
    );
}
