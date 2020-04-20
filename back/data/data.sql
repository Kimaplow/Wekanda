DROP TABLE IF EXISTS Score;
DROP TABLE IF EXISTS TagQuizz;
DROP TABLE IF EXISTS Answers;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Quizz;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Tags;



CREATE TABLE User(
    id_user SERIAL primary key,
    pseudo varchar(50) NOT NULL,
    password varchar(200) NOT NULL,
);

CREATE TABLE Quizz(
    id_quizz SERIAL primary key,
    id_creator integer foreign key REFERENCES User(id_user) NOT NULL,
    titre varchar(50) NOT NULL,
    path_file varchar(50),
    difficulty smallint CHECK (difficulty>=0 AND difficulty <=3) NOT NULL
);

CREATE TABLE Questions(
    id_question SERIAL primary key,
    id_quizz integer foreign key REFERENCES Quizz(id_quizz) NOT NULL,
    question varchar(50) NOT NULL,
    path_file varchar(50)
);

CREATE TABLE Answers(
    id_answer SERIAL primary key,
    id_question integer foreign key REFERENCES Questions(id_question) NOT NULL,
    answer varchar(50),
    path_file varchar(50),
    correct boolean NOT NULL
);

CREATE TABLE Score(
    id_score SERIAL primary key,
    id_user integer foreign key REFERENCES User(id_user) NOT NULL,
    id_quizz integer foreign key REFERENCES Quizz(id_quizz) NOT NULL
);

CREATE TABLE Tags(
    tag varchar(15) primary key
);

CREATE TABLE TagQuizz(
    id_quizz integer foreign key REFERENCES Quizz(id_quizz),
    tag varcher(15) foreign key REFERENCES Tags(tag),
    PRIMARY KEY (id_quizz,tag)
);
