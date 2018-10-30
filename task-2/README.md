# hackerbay-university-tasks 

## Task 2 - Connecting to a Database

## Objectives

- Learn how to connect to a database from the backend. 
- Learn how to save and query data from your databse. 
- Learn Authentication with Passport + JWT. 

1. Project Summary

- This project uses PostgreSQL as the database and implements a very simple `Local Startegy` with PassportJS. This give a simple login and signup mechanism as any other service out on the internet.
- Here's the schema of the user table in the database. 
```
id: Randomly Generated ID by the DB. 
email: Email of the user. 
password: Encrypted Password of the user. 
```

2. User sign up API

- A POST API that takes in a user's email and password, saves those credentials in the User Table in the database and returns `{session: <token>}` as response.
```
Request Type: POST
Route: /user/signup
Request Body: {email: sample@sample.com, password: "SamplePassword"}
Response Code: 200 
Response Body: {session: <token>}
```

- Before saving a new user, the API checks for to ensure the email is not already existing. If it exists, it returns Status Code 400
 
```
Request Type: POST
Route: /user/signup
Request Body: {email: sample@sample.com, password: "SamplePassword"}
Response Code: 400 
Response Body: {error: "User already exists."}
```

3. Login API

- A POST API which takes in an email and password, validates those credentials with the User Table in the database and Returns `{session: <token>}` as response.
 
```
Request Type: POST
Route: /user/login
Request Body: {email: sample@sample.com, password: "SamplePassword"}
Response Code: 200 
Response Body: {session: <token>}
```

- If user enters an invalid password, it returns a Status code of 400.

```
Request Type: POST
Route: /user/login
Request Body: {email: sample@sample.com, password: "WrongPassword"}
Response Code: 400 
Response Body: {error: "Invlaid Password"}
```

- If the user does not exists, API returns Status code 400.

```
Request Type: POST
Route: /user/login
Request Body: {email: invalidemail@sample.com, password: "SamplePassword"}
Response Code: 400 
Response Body: {error: "User does not exist."}
```
 