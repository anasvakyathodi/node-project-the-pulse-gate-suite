# The Pulse Gate Suite (Backend)

Live Demo: [Click here](https://the-pulse-gate-project.vercel.app/login) (Frontend)

Backend: [Click here](https://the-pulse-suite.herokuapp.com/)

## Getting Started (for running on local)

1. Clone from git URL and goto project folder

   ```bash
   git clone https://github.com/anasvakyathodi/node-project-the-pulse-gate-suite.git
   ```

   ```bash
   cd node-project-the-pulse-gate-suite.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```
3. Run the app in development mode
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.

## Routes

### User Routes

- Create User

  Request Type: POST

  ```http
  http://localhost:5000/users/register
  ```

  Body:

  ```json
  {
    "email": "example@gmail.com",
    "password": "example",
    "passwordCheck": "example",
    "displayName": "example",
    "userType": "author" // or admin
  }
  ```

  Response:

  ```json
  {
    "status": "Success",
    "msg": "Successfully Registered!"
  }
  ```

- Login

  Request Type: POST

  ```http
  http://localhost:3000/users/login
  ```

  Body :

  ```json
  {
    "email": "example@gmail.com",
    "password": "example"
  }
  ```

  Response :

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV....",
    "user": {
      "id": "61f274fe516f27644f8383c7",
      "displayName": "example",
      "userType": "admin"
    }
  }
  ```

- Logout

  Request Type: POST

  ```http
  http://localhost:3000/users/logout
  ```

  Header :

  ```json
  {
    "Authorization": "token-string"
  }
  ```

  Response :

  ```json
  {
    "status": "Success",
    "msg": "Successfully Logged Out!"
  }
  ```

### Article Routes

- Fetch Articles

  Request Type: GET

  ```http
  http://localhost:3000/articles/
  ```

  Query:

  ```json
  {
    "limit": "<number>", // rows per page
    "page": "<number>" // page number
  }
  ```

  Header :

  ```json
  {
    "Authorization": "token-string"
  }
  ```

  Response :

  ```json
  {
    "status": "Success",
    "data": [
      {
        "_id": "article id goes here",
        "title": "Article 1",
        "content": "content 1",
        "authorId": "user-id",
        "authorName": "example",
        "submissionTime": "Date ",
        "status": "rejected", // or "accepted" or "no action"
        "remarks": "remark", // or null
        "__v": 0
      }
    ],
    "count": 16 // total number of articles
  }
  ```

- Create an Article

  Request Type: POST

  ```http
  http://localhost:3000/articles/create
  ```

  Body:

  ```json
  {
    "title": "<name>",
    "content": "<content>"
  }
  ```

  Header :

  ```json
  {
    "Authorization": "token-string"
  }
  ```

  Response :

  ```json
  {
    "status": "Success",
    "msg": "Successfully Created"
  }
  ```

- Update an Article

  Request Type: PATCH

  ```http
  http://localhost:3000/articles/update
  ```

  Body:

  ```json
  {
    "id": "<article id>",
    "title": "<number>", // either title or content or both
    "content": "<number>"
  }
  ```

  Header :

  ```json
  {
    "Authorization": "token-string"
  }
  ```

  Response :

  ```json
  {
    "status": "Success",
    "msg": "Successfully Updated"
  }
  ```

- Review an Article

  Request Type: POST

  ```http
  http://localhost:3000/articles/review
  ```

  Body:

  ```json
  {
    "id": "<article id>",
    "action": "action", // either "accepted" or "rejected"
    "remarks": "<any other remarks / suggestions>" // optional
  }
  ```

  Header :

  ```json
  {
    "Authorization": "token-string"
  }
  ```

  Response :

  ```json
  {
    "status": "Success",
    "msg": "Successfully Submitted"
  }
  ```

## Technologies Used

- Node JS
- Javascript
- Mongoose
- Mongo DB Database

_Server is Deployed on Heroku_
