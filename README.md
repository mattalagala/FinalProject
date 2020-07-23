# PROJECT VAULT

Project Vault is a market for final projects or any projects that bootcamp students want to showcase. Users will be able to sign in individually or as a group and highlight various attributes (screenshots, descriptions, languages, functionality, etc) for their project. These projects will be available for employers to browse through and contact the groups if they so choose. 

## PROJECT VAULT USERS INPUT


![alternativetext](public/uploads/mattprojec1.jpg)



## PROJECT VAULT USERS INPUT
Users will be required to provide the following inputs for a NEW PROJECT:

Project Name: 
Project Description: 
Project Highlights: <!-- What did you learn from this project (Something that will make the teams marketable to future employers)-->
Project Screencaptures: <!-- 3 - 5 Screen captures per project>

Team Name:
Team Members:
Languages Utilized:
Contact Info:

## SCOPE
Project Vault will take the user inputs store it in a pSQL db. New projects will display at the top with other projects in chronological order as default. 

## SUBSCRIBERS
Subscribers will be able to browse through the projects chronologically or by utilizing several sorting filters. 

## FUTURE RELEASES
1. In future releases Project Vault will be able to email subscribers (specifically employers) of future projects. 
2. Implement various filter methods. 


Phase2Project - Inventory App
Create an app that interfaces psql db with frontend.

Workflow
<img src= of Workflow

Setup
Create an app that interfaces psql db with frontend.

npm init -- creates package.json

npm intall knex -- installs knex dependency to interface with pg db

npm install express -- install express.js lib

npm install pg -- installs pg interface for knex and psql

cat package.json -- verify dependecies have been added

npm install knex --save -- creates knexfile.js -- make sure knexfile.js has development environment info.

npx knex init -- create 'knexfile.js'

  module.exports = {

        development: {
            client: 'postgresql',
            connection: {
            database: 'YOUR DB HERE',
            user:     '------',
            password: '------'
            },
            pool: {
            min: 2,
            max: 10
            },
            migrations: {
            tableName: 'knex_migrations'
            }
        }

        };
cp knexfile.js example.knexfile.js - copies generic knexfile.js template to example.knefile.js

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'your database',
      user:     'your username',
      password: 'your password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
ADD KNEXFILE.JS to .gitignore

node_modules
.DS_Store
knexfile.js
CREATE MIGRATIONS

npx knex migrate:make 'MIGRATION_FILE_NAME.js' //Create your migration file//

npx knex migrate:up //Use your migration file//

CREATE YOUR SEED DATA

npx knex seed:make 'SEED_FILE_NAME.js' //CREATES SEED FILE//

npx knex seed:run || npx knex seed: run --specific 'FILENEAME.js' //RUNS SEED DATA//