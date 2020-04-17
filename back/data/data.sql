DROP TABLE IF EXISTS Score;
DROP TABLE IF EXISTS TagQuizz;
DROP TABLE IF EXISTS Answers;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Quizz;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Tags;



CREATE TABLE User(
    uno SERIAL primary key,
    pseudo varchar(50) NOT NULL,
    password varchar(200) NOT NULL,
);

CREATE TABLE Quizz(
    quino SERIAL primary key,
    id_creator integer foreign key REFERENCES User(uno) NOT NULL,
    titre varchar(50) NOT NULL,
    path_file varchar(50),
    difficulty smallint CHECK (difficulty>=0 AND difficulty <=3) NOT NULL
);

CREATE TABLE Questions(
    queno SERIAL primary key,
    id_quizz integer foreign key REFERENCES Quizz(quino) NOT NULL,
    question varchar(50) NOT NULL,
    path_file varchar(50)
);

CREATE TABLE Answers(
    ano SERIAL primary key,
    id_question integer foreign key REFERENCES Questions(queno) NOT NULL,
    answer varchar(50),
    path_file varchar(50),
    correct boolean NOT NULL
);

CREATE TABLE Score(
    sno SERIAL primary key,
    id_user integer foreign key REFERENCES User(uno) NOT NULL,
    id_quizz integer foreign key REFERENCES Quizz(quino) NOT NULL
);

CREATE TABLE Tags(
    tno SERIAL primary key,
    tag varchar(15)
);

CREATE TABLE TagQuizz(
    id_quizz integer foreign key REFERENCES Quizz(quino),
    id_tag integer foreign key REFERENCES Tags(tno),
    PRIMARY KEY (id_quizz,id_tag)
);