import React, { useState, useEffect } from 'react';
import config from '../config';
import { Icon, Modal, Card, CardTitle } from 'react-materialize';
import * as apiget from '../APIcalls/APIget';
import './css/quizzcard.css';


export default function QuizzCard(props) {

    //Récupérer le score
    const [scoreMax, setScoreMax] = useState({});
    function getScore(id_quizz){
        apiget.fetchScoreMax(id_quizz).then(res =>
            setScoreMax(res),
        );
    }

    //Il faut récupérer le joueur

    function displayDiff(diff) {
        let message = 'Niveau de quizz : ';
        switch (diff) {
            case 1:
                message += "facile";
                break;
            case 2:
                message += "moyenne";
                break;
            case 3:
                message += "difficile";
                break;

            default:
                message += "non renseignée";
        }
        return message;
    }

    useEffect(() => {
        getScore(props.quizz.id_quizz);
    }, []);

    const trigger = <a href='#'>Infos</a>

    return (
        <div id='quizz-card-container'>
            
            <Card
                id='quizz-card-card'
                actions={[
                    <a key="1" href={`/quizz/${props.quizz.id_quizz}/play`}>Jouer</a>,
                    <a key="2" href={`/edit/${props.quizz.id_quizz}`}>Modifier</a>,
                    <Modal key='3' header={props.quizz.title} trigger={trigger}>
                        <p>{displayDiff(props.quizz.difficulty)}</p>
                        <p>Meilleur score : {scoreMax.maxi ? scoreMax.maxi : 'Pas encore de score !'}</p>
                        <p>Meilleur joueur : </p>
                    </Modal>
                ]}
                closeIcon={<Icon>close</Icon>}
                header={<CardTitle id='quizz-card-img' image={`http://${config.server}/img/${props.quizz.path_file}`} />}
                horizontal
            >
                <p id='title-quizz-card'>{props.quizz.title}</p>
                <p>{props.quizz.description}</p>
            </Card>

        </div>

    );
}