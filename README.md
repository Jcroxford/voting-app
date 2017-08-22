# Voting App
This is a basic Node, Express, and PostgreSQL app built to fulfill the [FreeCodeCamp](https://www.freecodecamp.com) project requirements for the [Voting App](https://www.freecodecamp.com/challenges/build-a-voting-app) project.

## User Stories(requirements)
1. As an authenticated user, I can keep my polls and come back later to access them.
2. As an authenticated user, I can share my polls with my friends.
3. As an authenticated user, I can see the aggregate results of my polls.
4. As an authenticated user, I can delete polls that I decide I don't want anymore.
5. As an authenticated user, I can create a poll with any number of possible items.
6. As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
7. As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

## How to Use
more info will be provided as development progress

## Dev Notes
A config.json file must be provided in order for this project to run locally. 

The config file must contain the following variables for both tseting and development
* **port** the port you wish to use to host the app locally
* **environment** value of current environment(dev, test, prod)
* **database** the name of the database you are using for the config
* **dbUsername** username of local admin of your pg database
* **dbPassword** password for *dbUsername* mentioned above
* **dialect** database being used in testing(this should be postgreSQL)
* **secret** secret used for generating jwt tokens

**Example config**
```json
{
  "test": {
    "port": 3000,
    "environment": "test",
    "database": "voting-app-test",
    "dbUsername": "root",
    "dbPassword": "root",
    "dialect": "postgres",
    "secret": "some secret value"
  },
  "development": {
    "port": 3000,
    "environment": "development",
    "database": "voting-app-dev",
    "dbUsername": "root",
    "dbPassword": "root",
    "dialect": "postgres",
    "secret": "some secret value"
  }
}
```

This project was built using PostgreSQL. You must have postgres installed in order to run the project locally. 

## TODOS
* get a favicon
* figure out how to use debug npm module
* public and views folders are not currently in use. Remove if we end up never needing them
* learn about how to implement session storage and use it in this app as a means to keep track of polls that a user has voted on.
* update routes to follow a more traditional rest api design? (if done, update tests, routes, & docs with the new routes)
* add helment.js to app to secure all the things
* refactor routes/index and models/Users so that Users model contains more of the logic?
* add toggle for hidden/visible text during password steps client side

## Limitations/implementations to Consider
* user should only be able to vote on a poll once(check and store ip address?) (look into session storage to accomplish this probably) [disussion](https://forum.freecodecamp.org/t/voting-app-preventing-non-logged-in-users-from-voting-twice/35489/2)
* add sharing to social media? (twitter, facebook maybe prepoulate stuff)
* passport authentication for github? twitter? 
* implement real time chart updating?
* should duplicate poll's be prevented? not entirely conviced it's bad
* change create user to signup accross app
* executive decision has been made that until opinions changed, password strength/requirements will only be assessed on the client side
* I am starting /api/polls & /api/user/polls routes with pagination but considering trying to use lazy loading to make a more fluid