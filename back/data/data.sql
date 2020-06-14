drop schema if exists wekanda CASCADE;
create schema wekanda;
set search_path to wekanda;

CREATE TABLE Users(
    id_user SERIAL primary key,
    pseudo varchar(50) NOT NULL,
    mail varchar(50) UNIQUE NOT NULL,
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
    id_quizz integer REFERENCES Quizz(id_quizz) ON DELETE CASCADE NOT NULL,
    question varchar(100) NOT NULL,
    path_file varchar(50)
);

CREATE TABLE Answers(
    id_answer SERIAL primary key,
    id_question integer REFERENCES Questions(id_question) ON DELETE CASCADE NOT NULL,
    answer varchar(50),
    path_file varchar(50),
    correct boolean NOT NULL
);

CREATE TABLE Score(
    id_score SERIAL primary key,
    id_user integer REFERENCES Users(id_user) NOT NULL,
    id_quizz integer REFERENCES Quizz(id_quizz) ON DELETE CASCADE NOT NULL,
    score integer DEFAULT 0 CHECK(score>0)
);

CREATE TABLE Tags(
    tag varchar(15) primary key
);

CREATE TABLE TagQuizz(
    id_quizz integer REFERENCES Quizz(id_quizz) ON DELETE CASCADE,
    tag varchar(15) REFERENCES Tags(tag),
    PRIMARY KEY (id_quizz,tag)
);




INSERT INTO Users(pseudo, mail, password) VALUES
    ('Admin', 'admin@test.com', '$2b$10$uudLDjCCQF/SHhut2dcZVOiSm5dE3nw8dAb.tF6b.wBVpw6B4PNzu'),
    ('Christophe', 'christophe@test.com','$2b$10$9UEwbdEw3gmwovs9bLaTWekHAK6YvjjTIffpfekx.RsWZB3u9Q9re'),
    ('Mathieu','mathieu@test.com', '$2b$10$HfvnZiiBEFhkR21XgCC9.esRId2GdQPGTmctgXcEofJlGui1vY7nu'),
    ('Francois', 'francois@test.com','$2b$10$h4Zj6vVtiEGaFbsk6QPWBe0mkDP.dNjWXGqREzz0NJI/Lx0z4D8mC'),
    ('Testuser', 'testuser@test.com', '$2b$10$0C66vlK7CJItKcipiurfE.XxosFoJRdjWUMwJK1.b72hyGXvqw1he');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('1', 'Les animaux Africains','animaux_afrique.jpg', '1', 'Pour apprendre les animaux en s''amusant');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('1','Qui a le plus long cou ?',''),
    ('1','Quel animal est le plus gros ?',''),
    ('1','Quel est le plus rapide ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('1','Girafe','true', ''),
    ('1','Antilope','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('2','Hippopotame','true', ''),
    ('2','Lion','false', ''),
    ('2','Hyène','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('3','Guépard','true', ''),
    ('3','Tigre','false', ''),
    ('3','Lion','false', '');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('1', 'Les Rois de France','rois_France.jpg', '3', 'Il fallait une raison pour manger la galette');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('2','Qui est le premier roi des Francs ?',''),
    ('2','Quel roi a eu le règne le plus court ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('4','Clovis Ier','true', ''),
    ('4','Charlemagne','false', ''),
    ('4','Louis XIV','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('5','Louis XIX','true', ''),
    ('5','Louis XVI','false', ''),
    ('5','Louis XIV','false', '');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('2', 'Le Cinema français','cinema.jpg', '3', 'C''est pas ouf');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('3','Quel est le plus grand succès du cinéma français ?',''),
    ('3','Qui a réalisé Astérix et Obélix : Mission Cléopâtre ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('6','Bienvenue chez les ch''ti','true', ''),
    ('6','La grande vadrouille','false', ''),
    ('6','La 7ème compagnie','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('7','Jamel Debbouze','false', ''),
    ('7','Alain Chabat','true', ''),
    ('7','Guillaume Canet','false', '');


INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('2', 'Rap U.S.','musique.jpg', '3', 'Ca c''est cool');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('4','Quel rappeur a vendu le plus de disques ?',''),
    ('4','Quel est l''interprêtre de ''In da Club'' ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('8','Tupac','false', ''),
    ('8','The Notorious B.I.G.','false', ''),
    ('8','Eminem','true', ''),
    ('8','Drake','false', '');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('9','Dr. DRE','false', ''),
    ('9','Eminem','false', ''),
    ('9','50 cent','true', '');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('3', 'Tableaux et Peintres','bob.jpg', '2', 'Let''s slap the devil out of it');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('5','Quel Tableau a été peint par Salvador Dali ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('10', 'Guernica', 'false', 'guernica.jpg'),
    ('10', 'La Persistance de la Mémoire', 'true', 'persistance.jpg'),
    ('10', 'Le Radeau de la Méduse', 'false', 'radeau.jpg'),
    ('10', 'La Nuit étoilée', 'false', 'nuit_etoilee.jpg');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('3', 'Culture internet','stonks.jpg', '2', 'STONKS');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('6','De quelle origine est cette video ?','nyan.mp4');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('11','Américaine', 'true', ''),
    ('11','Francaise', 'false', ''),
    ('11','Japonaise', 'true', ''),
    ('11','Brésilienne', 'false', '');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('4', 'Jeux vidéo','', '1', 'My body is ready');

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('7','Comment s''appelle cette console ?','ps2.png');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('12','Playstation 2', 'true', ''),
    ('12','Playstation Portable', 'false', ''),
    ('12','Playstation', 'true', ''),
    ('12','Playstation 3', 'false', '');




INSERT INTO Quizz(id_creator, title, path_file, difficulty, description) VALUES
    ('4', 'Anglais', 'britain.jpg', '1', 'In English plz');  

INSERT INTO Questions(id_quizz, question, path_file) VALUES
    ('8','Que signifie le mot "house" en anglais ?','');

INSERT INTO Answers(id_question, answer, correct, path_file) VALUES
    ('13','Manoir', 'false', ''),
    ('13','Ecole', 'false', ''),
    ('13','Eglise', 'false', ''),
    ('13','Maison', 'true', '');




INSERT INTO Tags(tag) VALUES
    ('Histoire'),
    ('Internet'),
    ('Animaux'),
    ('Afrique'),
    ('Art'),
    ('Jeux vidéo');

INSERT INTO TagQuizz(id_quizz, tag) VALUES
    ('1', 'Animaux'),
    ('1', 'Afrique'),
    ('2', 'Histoire'),
    ('3', 'Art'),
    ('4', 'Internet'),
    ('5', 'Art'),
    ('6','Internet'),
    ('7','Jeux vidéo');




INSERT INTO Score(id_user, id_quizz, score) VALUES
    ('1','4','5'),
    ('2','3','8'),
    ('3','2','9'),
    ('4','1','10');
