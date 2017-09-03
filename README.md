# Voting App
This is a basic Node, Express, and PostgreSQL app. built to fulfill the [FreeCodeCamp](https://www.freecodecamp.com) project requirements for the [Voting App](https://www.freecodecamp.com/challenges/build-a-voting-app) project. User stories below explain basic functionalities. You can view a live version of the app [here](https://votehub-app.herokuapp.com/)

## User Stories(requirements)
1. As an authenticated user, I can keep my polls and come back later to access them.
2. As an authenticated user, I can share my polls with my friends.
3. As an authenticated user, I can see the aggregate results of my polls.
4. As an authenticated user, I can delete polls that I decide I don't want anymore.
5. As an authenticated user, I can create a poll with any number of possible items.
6. As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
7. As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

## How to Use
1. Clone the repo and run npm install in buth the source and client directories. 
2. From command line, use the command `npm run dev` to start rest api server from root directory.
   * for details about current rest api endpoints, look [here](./apiReference.md)
3. From another command line, cd into client directory and use the command `yarn start` to start up the webpack dev server for the client.

## Dev Notes
A config.json file must be provided in the config directory in order for this project to run locally. 

The config file must contain the following variables for both tseting and development
* **port** the port you wish to use to host the app locally
* **environment** value of current environment(dev, test, prod)
* **database** the name of the database you are using for the config
* **dbUsername** username of local admin of your pg database
* **dbPassword** password for *dbUsername* mentioned above
* **dialect** database being used in testing(this should be postgreSQL)
* **secret** secret used for generating jwt tokens

**Example config.json File**
```json
{
  "test": {
    "port": 3030,
    "environment": "test",
    "database": "voting-app-test",
    "dbUsername": "root",
    "dbPassword": "root",
    "dialect": "postgres"
  },
  "development": {
    "port": 3030,
    "environment": "development",
    "database": "voting-app-dev",
    "dbUsername": "root",
    "dbPassword": "root",
    "dialect": "postgres"
  }
}
```

You must also include a file in the config directory called `secret.js`. This file must contain the secret you wish to use to hash a user's passwords.

**Example secret.js File**
```javascript
module.exports.secret = 'some secret value'
```

This project was built using PostgreSQL. It's reccomended you use and have postgres installed when running project locally.

**Note** Make sure `client/src/utils/api.js` has the correct local route for local api server.


## TODOS
* all done for now! Leaving to category here though just in case.
