# Voting App
This is a basic Node, Express, and PostgreSQL app built to fulfill the [FreeCodeCamp](https://www.freecodecamp.com) project requirements for the [Voting App](https://www.freecodecamp.com/challenges/build-a-voting-app) project.

## User Stories(requirements)
1) As an authenticated user, I can keep my polls and come back later to access them.
2) As an authenticated user, I can share my polls with my friends.
3) As an authenticated user, I can see the aggregate results of my polls.
4) As an authenticated user, I can delete polls that I decide I don't want anymore.
5) As an authenticated user, I can create a poll with any number of possible items.
6) As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
7) As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)
8) As an authenticated user, if I don't like the options on a poll, I can create a new option.

## How to Use
more info will be provided as development progress

## Dev Notes
A config.json file must be provided in order for this project to run locally. 

The config file must contain the following variables for both tseting and development
* port: the port you wish to use to host the app locally

**Example config**
```json
{
  "test": {
    "port": 3000
  },
  "development": {
    "port": 3000
  }
}
```

## TODOS
* get a favicon
* figure out how to use debug npm module