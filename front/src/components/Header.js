import React from 'react';
import './css/header.css';
import 'materialize-css';
import { Dropdown, Icon } from 'react-materialize';

export default function Header() {

    return (
        <div className="header">
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
                        <li>
                            <Dropdown
                                id="dropdown-filter"
                                options={{
                                    alignment: 'right',
                                    autoTrigger: true,
                                    closeOnClick: true,
                                    constrainWidth: true,
                                    container: null,
                                    coverTrigger: true,
                                    hover: false,
                                    inDuration: 150,
                                    onCloseEnd: null,
                                    onCloseStart: null,
                                    onOpenEnd: null,
                                    onOpenStart: null,
                                    outDuration: 250
                                }}
                                trigger={<a node="button"><Icon>tune</Icon></a>}
                            >
                                <a href="#">select</a>

                            </Dropdown>
                        </li>

                        <li><a href="#"><i className="material-icons">person_outline</i></a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
