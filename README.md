# Backend du projet handimove

## Project overview
Backend du projet handimove .


## Technologies
- Node.JS pour interroger la base de donnée 
- JWT Token
- Cypress

## Installation
Installer les packages dans le dossier backend_handimove
```bash
npm install 
```

Installer la base de donnée avec le script de celle ci.
Créer un fichier .env dans le dossier backend_handimove avec ce modèle

DB_HOST= vôtre hote \
DB_PORT= vôtre port de base de donnée \
DB_USER=vôtre nom d'utilisateur \
DB_PASS= vôtre mot de passe de base de donnée \
DB_DB= le nom de la base de donnée 
JWT_SECRET= le mot de passe du backend

Then create a Conf.js file with :
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DB,
    port: process.env.DB_PORT
});

--------------------------

# Backend of the Handimove project

## Project overview
Backend of the handimove project


## Technologies used 
- Node.JS to create the server routes and database requests
- JWT Token
- Cypress

## Installation
Install packages in backend_handimove
```bash
npm install 
```

Install the sample database using the script od database
Create a .env file in backend_handimove folder using the following model 

DB_HOST=your database host \
DB_PORT=your database port \
DB_USER=your database user \
DB_PASS=your database password \
DB_DB=your database name 
JWT_SECRET=your secret

Then create a Conf.js file with :
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DB,
    port: process.env.DB_PORT
});
