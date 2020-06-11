import React, { useState, useEffect } from 'react';
import config from '../config';
import { Icon, Modal, Card, CardTitle, Button } from 'react-materialize';
import * as apiget from '../APIcalls/APIget';
import './css/quizzcard.css';

export default function QuizzCard(props) {

    const [scoreMax, setScoreMax] = useState({});
    const [creator, setCreator] = useState({});

    function getScore(id_quizz){
        apiget.fetchScoreMax(id_quizz).then(res =>
            setScoreMax(res),
        );
    }

    function getCreator(id_user){
        apiget.fetchUser(id_user).then(res =>
            setCreator(res),
        );
    }

    function displayDiff(diff) {
        let message = 'Niveau du quizz : ';
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
        getCreator(props.quizz.id_creator);
    }, []);

    const trigger = <a href='#'>Infos</a>

    return (
        <div id='quizz-card-container'>
            
            <Card
                id='quizz-card-card'
                actions={[
                    <a key="1" href={`/quizz/${props.quizz.id_quizz}/play`}>Jouer</a>,
                    <a key="2" href={`/edit/${props.quizz.id_quizz}`}>Modifier</a>,
                    <Modal key='3' header={props.quizz.title} trigger={trigger}
                        actions={[
                        <Button flat modal="close" node="button"><Icon className="close-modal">close</Icon></Button>
                        ]}
                    >
                        <p>Createur du quizz : {creator ? creator.pseudo : undefined}</p>
                        <p>{displayDiff(props.quizz.difficulty)}</p>
                        <p>Meilleur score : {scoreMax.highest ? scoreMax.highest : 'Pas encore de score !'}</p>
                        <p>Meilleur joueur : {scoreMax.pseudo ? scoreMax.pseudo : 'Pas encore de meilleur joueur !'}</p>
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