drop schema if exists wekanda CASCADE;
create schema wekanda;
set search_path to wekanda;

CREATE TABLE Users(
    id_user SERIAL primary key,
    pseudo varchar(50) NOT NULL,
    password varchar(200) NOT NULL
);

CREATE TABLE Quizz(
    id_quizz SERIAL primary key,
    id_creator integer REFERENCES Users(id_user) NOT NULL,
    title varchar(50) NOT NULL,
    path_file varchar(50),
    difficulty smallint CHECK (difficulty>0 AND difficulty <=3) NOT NULL,
    description varchar(140)
);

CREATE TABLE Questions(
    id_question SERIAL primary key,
    id_quizz integer REFERENCES Quizz(id_quizz) NOT NULL,
    question varchar(50) NOT NULL,
    path_file varchar(50)
);

CREATE TABLE Answers(
    id_answer SERIAL primary key,
    id_question integer REFERENCES Questions(id_question) NOT NULL,
    answer varchar(50),
    path_file varchar(50),
    correct boolean NOT NULL
);

CREATE TABLE Score(
    id_score SERIAL primary key,
    id_user integer REFERENCES Users(id_user) NOT NULL,
    id_quizz integer REFERENCES Quizz(id_quizz) NOT NULL,
    score integer DEFAULT 0 CHECK(score>0)
);

CREATE TABLE Tags(
    tag varchar(15) primary key
);

CREATE TABLE TagQuizz(
    id_quizz integer REFERENCES Quizz(id_quizz),
    tag varchar(15) REFERENCES Tags(tag),
    PRIMARY KEY (id_quizz,tag)
);

INSERT INTO Users(pseudo, password) VALUES
    ('Admin', 'Admin'),
    ('Christophe', 'Christophe'),
    ('Mathieu', 'Mathieu'),
    ('Francois', 'Francois');

<<<<<<< HEAD
INSERT INTO Quizz(id_creator, title, path_file, difficulty) VALUES
    ('1', 'Les animaux Africains','animaux_afrique.jpg', '1'),
    ('2', 'Les Rois de France','rois_France.jpg', '3'),
    ('2', 'Le Cinema français','cinema.jpg', '3'),
    ('2', 'Rap U.S.','musique.jpg', '3'),
    ('3', 'Tableaux et Peintres','bob.jpg', '2'),
    ('4', 'Culture internet','stonks.jpg', '2'),
    ('3', 'Anglais', 'britain.jpg', '1'),
    ('2', 'TestPasDeQuestions', 'britain.jpg', '1');
=======
INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('1', 'Les animaux Africains','animaux_afrique.jpg', '1', 'Pour apprendre les animaux en s''amusant'),
    ('2', 'Les Rois de France','rois_France.jpg', '3', 'Il fallait une raison pour manger la galette'),
    ('2', 'Le Cinema français','cinema.jpg', '3', 'C''est pas ouf'),
    ('2', 'Rap U.S.','musique.jpg', '3', 'Ca c''est cool'),
    ('3', 'Tableaux et Peintres','bob.jpg', '2', 'Let''s slap the devil out of it'),
    ('4', 'Culture internet','stonks.jpg', '2', 'STONKS'),
    ('3', 'Anglais', 'britain.jpg', '1', 'In English plz');
>>>>>>> cfad15a7deb1714abf6559ac6ee6e662ffb687eb

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('1','Qui a le plus long cou ?',''),
    ('1','Quel animal est le plus gros ?',''),
    ('1','Quel est le plus rapide ?','');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('2','Qui est le premier roi des Francs ?',''),
    ('2','Quel roi a eu le règne le plus court ?','');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('3','Quel Tableau a été peint par Salvador Dali ?','');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('6','De quelle origine est cette video ?','nyan.mp4');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('7','Que signifie le mot "house" en anglais ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('1','Girafe','true', ''),
    ('1','Christina Cordula','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('2','Hippopotame','true', ''),
    ('2','Lion','false', ''),
    ('2','Gerard Depardieu','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('3','Guépard','true', ''),
    ('3','Tigre','false', ''),
    ('3','Usain Bolt','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('4','Clovis Ier','true', ''),
    ('4','Charlemagne','false', ''),
    ('4','Louis XIV','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('5','Louis XIX','true', ''),
    ('5','Louis XVI','false', ''),
    ('5','Louis XIV','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('6', 'Guernica', 'false', 'guernica.jpg'),
    ('6', 'La Persistance de la Mémoire', 'true', 'persistance.jpg'),
    ('6', 'Le Radeau de la Méduse', 'false', 'radeau.jpg'),
    ('6', 'La Nuit étoilée', 'false', 'nuit_etoilee.jpg');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('7','Américaine', 'true', ''),
    ('7','Francaise', 'false', ''),
    ('7','Japonaise', 'true', ''),
    ('7','Brésilienne', 'false', '');
    
INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('8', '', 'false', 'ecole.jpg'),
    ('8', '', 'false', 'eglise.jpg'),
    ('8', '', 'true', 'maison.jpg'),
    ('8', '', 'false', 'mairie.jpg');

INSERT INTO Score(id_user, id_quizz, score) VALUES
    ('1','4','5'),
    ('2','3','8'),
    ('3','2','9'),
    ('4','1','10');

INSERT INTO Tags(tag) VALUES
    ('Histoire'),
    ('Internet'),
    ('Animaux'),
    ('Afrique'),
    ('Art');

INSERT INTO TagQuizz(id_quizz, tag) VALUES
    ('1', 'Animaux'),
    ('1', 'Afrique'),
    ('2', 'Histoire'),
    ('3', 'Art'),
    ('4', 'Internet'),
    ('5', 'Art'),
    ('6','Internet');