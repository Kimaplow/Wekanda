# Wekanda - Quizz App

Wekanda is a `Quizz App` that allows `people` to `play quizzes` around different
`themes/categories`.



## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have `npm` and `node` installed
* A `Postgresql DB` if you're **not** using Docker
* You have `Docker` installed (**optional**)

## Made with

* [Express](https://expressjs.com/en/) for the backend API
* [React.JS](https://en.reactjs.org) for the frontend

## Installing Wekanda

To install the app, follow these steps:

- First, clone the project : 
```bash 
git clone https://github.com/Galimede/Wekanda.git
```
- Now with npm :
```
cd front
npm i
cd ../back 
npm i
```

**Note:** If you're using npm you will have to modify the `config.js` 
in `back/config/config.js` and run the sql script associated in 
`back/data/data.sql` in order to run it properly.


Now the project is ready; 

## Using and launching Wekanda

In order to launch or use Wekanda, you can either use 

* Docker : 

Place yourself in the root of the project then do :
```
docker-compose up
```

* Npm :

On one terminal do :
```
cd front 
npm run start
```
On another one do :
```
cd back
npm run start
```

Now you're ready to go 😃

# Authors

* [@Galimede](https://github.com/Galimede) 
* [@Kimaplow](https://github.com/Kimaplow) 
* [@sgttabouret](https://github.com/sgttabouret) 

