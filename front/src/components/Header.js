import React from 'react';
import './css/materialize.css';
import './css/header.css';

export default function Header(){

    return(

        <nav>
            <div className="nav-wrapper grey darken-4">

                

                <a href="/home" className="brand-logo center">Wekanda</a>

                <ul className="right hide-on-med-and-down">
                    <li>
                        <form>
                            <div className="input-field">
                                <input id="search" type="search" required />
                                    <label className="label-icon" htmlFor="search"><i
                                        className="material-icons">search</i></label>
                                    <i className="material-icons">close</i>
                            </div>
                        </form>
                    </li>
                    <li><a href="#"><i className="material-icons">tune</i></a></li>
                    <li><a href="#"><i className="material-icons">person_outline</i></a></li>
                </ul>

            </div>
        </nav>
    );
}
