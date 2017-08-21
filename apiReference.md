## DB API Reference

### POST /api/signup
This route requires 3 paramaters. `username`, `email`, and `password` all three should be a string. If the username or email given have already been used, the route will return a 400 error.

**format for request**
``` javascript
{
  "username": "exampleName",
  "email": "example@email.com",
  "password": "password123"
}
```

### POST /api/user/createPoll
This route requires a jwt header attatched to the request. It requres 2 parameters. `title` is the title of the poll you wish to create. `options` is an array of options to be assigned to the poll. each item in the `options` array is an object that contains a key `pollText` which contains the title of the given poll option. Both poll `title` and `pollText` are limited to 255 characters.

**format for request**
``` javascript
{
  "title": "some poll title",
  "options": [
    {
      "pollText": "some poll option 1"
    },
    {
      "pollText": "some poll option 2"
    },
    ...
    {
      "pollText": "some poll option n"
    }
  ]
}
```

### GET /api/user/poll/delete/:pollId
This route requires jwt authorization. If authorized and owner of the pollId given in rest route, the poll and it's options will be removed from the database.

**formats for request (when running locally)**
```
http://localhost:3000/api/poll/delete/:pollId
```

**format of response**
``` javascript
{
  "success": "poll deleted successfully"
}
```

### POST /api/signin
This route is used for user login and requires 2 parameters. A `username` OR `email` and a `password`. The database will be searched using both username and email and if found, will attempt to authenticate the user based on their password. 

**formats for request**
``` javascript
{
  "username": "exampleName",
  "password": "password123"
}
```

``` javascript
{
  "email": "example@email.com",
  "password": "password123"
}

```

### POST /api/user/password/change
This route will update the password for a given user. It requires `currentPassword` and `newPassword` arguments as well as a valid jwt. Assuming the current password is correct, the database will be updated with the new password provided and return a json object with a `success` value.

**formats for request**
``` javascript
{
  "currentPassword": "password123!",
  "newPassword": "password1234!"
}
```

### GET /api/user/polls
Each request to this route returns all poll titles for an authenticated user.
This route does require a valid jwt be present in the authorization header

**formats for request (when running locally)**
```
http://localhost:3000/api/polls/2
```

**format of response**
``` javascript
{
  "totalPolls": 18,
  "polls": [
    {
      "id": 13,
      "title": "some poll title"
    },
    {
      "id": 14,
      "title": "another poll title"
    },
    ...
    {
      "id": 18,
      "title": "last poll title"
    }
  ]
}
```

### GET /api/polls/:page
Each request to this route returns the total number of polls in the database as well as a set of 12 polls based on the page requested within the route. 
If page given is invalid, an empty array is returned.

**formats for request (when running locally)**
```
http://localhost:3000/api/user/polls
```

**format of response**
``` javascript
{
  "polls": [
    {
      "id": 13,
      "title": "some poll title"
    },
    {
      "id": 14,
      "title": "another poll title"
    },
    ...
    {
      "id": 18,
      "title": "last poll title"
    }
  ]
}
```

### GET /api/polls/detail/:pollId
Each request to this route returns each all the poll options associated with the given pollId. This contains the poll option's title, total number of votes, and id.
If pollId given is invalid, an empty array is returned.

**formats for request (when running locally)**
```
http://localhost:3000/api/polls/detail/18
```

**format of response**
``` javascript
{
  "pollOptions": [
    {
      "id": 49,
      "pollText": "Lorem?",
      "voteCount": 0
    },
    {
      "id": 50,
      "pollText": "Ipsum?",
      "voteCount": 0
    },
    {
      "id": 51,
      "pollText": "Dolor?",
      "voteCount": 0
    }
  ]
}
```

### GET /api/poll/vote/:pollOptionId
This route requires is a public route. If `pollOptionId` given is valid, the pollOption vote tally will be updated in the database and a json will return the updated result as a success value. 

**formats for request (when running locally)**
```
http://localhost:3000/api/poll/vote/1
```

**format of response**
``` javascript
{
    "updatedVoteCount": 14
}
```
