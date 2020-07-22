import React, { useEffect, useState } from 'react';
import {Link, Redirect} from "react-router-dom";
import 'materialize-css';
import config from '../config';
import axios from "axios";
import { Dropdown, Icon } from 'react-materialize';
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";
import SearchQuizz from './SearchQuizz';
import "./css/header.css";

export default function Header() {

    const [tags, setTags] = useState([]);
    const [cookie, setCookie, removeCookie] = useCookies(['login']);
    const history = useHistory();

    async function getTags() {
        await axios.get(`http://${config.server}/tags`)
            .then(res => {
                setTags(res.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getTags();
    }, []);

    function renderTagsOption() {
        return tags.map(function (t, index){
            return (<Link key={index} to={`/quizzes/${t.tag}`}>{t.tag}</Link>)
        });
    }

    async function logout(e) {
        e.preventDefault();
        removeCookie('login', {path:"/"})
        history.push('/home');
    }

    function checkLogin() {
        if(cookie.login) {
            return [<a href="#" onClick={logout}>Se déconnecter</a>, <Link to={'/profile'}>Profil</Link>];
        } else {
            return [<Link to={'/signin'}>Se connecter</Link>];
        }
    }

    function search(event){
        event.preventDefault();
        let search = event.target.value;
        
        if(!search) return history.push('/home');
            
        return history.push(`/quizzes/search/${search}`)
    }

    function clearSearch(e) {
        e.preventDefault();

        document.querySelector("#search").value = "";
        return history.push('/home');
    }

    return (
        <div className="header">
            <nav>
                <div className="nav-wrapper grey darken-4">

                    <a href="/home" className="brand-logo center">Wekanda</a>

                    <ul className="right hide-on-med-and-down">
                    <li>
                        <form>
                            <div className="input-field">
                                <input id="search" type="search" onChange={e => search(e)} required />
                                    <label className="label-icon" htmlFor="search">
                                        <i className="material-icons">search</i></label>
                                    <i className="material-icons" onClick={e => clearSearch(e)}>close</i>
                            </div>
                        </form>
                    </li>
                        <li>
                            <Dropdown
                                id="dropdown-filter"
                                options={{
                                    alignment: 'right',
                                    autoTrigger: false,
                                    closeOnClick: false,
                                    constrainWidth: false,
                                    container: null,
                                    coverTrigger: true,
                                    hover: true,
                                    inDuration: 150,
                                    onCloseEnd: null,
                                    onCloseStart: null,
                                    onOpenEnd: null,
                                    onOpenStart: null,
                                    outDuration: 250
                                }}
                                trigger={<a node="button"><Icon>tune</Icon></a>}
                            >
                            {renderTagsOption()}
                            </Dropdown>
                        </li>

                        <li>
                        <Dropdown
                                id="dropdown-login"
                                options={{
                                    alignment: 'left',
                                    autoTrigger: false,
                                    closeOnClick: false,
                                    constrainWidth: false,
                                    container: null,
                                    coverTrigger: true,
                                    hover: true,
                                    inDuration: 150,
                                    onCloseEnd: null,
                                    onCloseStart: null,
                                    onOpenEnd: null,
                                    onOpenStart: null,
                                    outDuration: 250
                                }}
                                trigger={<a node="button"><Icon>person_outline</Icon></a>}
                            >
                            {checkLogin()}
                            </Dropdown>
                        </li>
                    </ul>
                </div>
            </nav>

        </div>
    );
}
