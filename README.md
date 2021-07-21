**The University of Melbourne WinterHack 2021**
# Team Valkyrie
# Group Project Repository

## Table of contents
* [Team Members](#team-members)
* [Link to our website](#link-to-our-website)
* [General Info](#general-info)
* [Detailed Info](#detailed-info)
* [Technologies](#technologies)
* [How to access our database](#how-to-access-our-database)
* [Instructions of Using code](#instructions-of-Using-code)




* [App server mockup(Deliverable 2)](#app-server-mockup-Deliverable-2)
* [Front end and back end (Deliverable 3)](#Front-end-and-back-end-Deliverable-3)
* [Web Application(Deliverable 4)](#Web-Application-Deliverable-4)


## Team Members

| Name | Student ID| Task | State |
| :---         |     :---:      |     :---:      |          ---: |
| Yu-Wen Michael Zhang  |1089117| Authentication of users, database sechema and connections|  Done |


## Link To Our Website
main page:
https://winterhack-valkyrie.herokuapp.com


## General info
The website we develop in this project is mainly used to calculate the score that the user need to achieve in every assignment based on a target overall score the user set.

## Detailed info
* This website needs user to login and register so that the user can access the full functionalities. We use **passport.js** to authenticate user and use **bcrypt** to encrypt user's password, which makes our website more securer. <br />

## Technologies
* NodeJs 14.16.X
* MongoDB Atlas
* Heroku 
* Handlebar

## How to access our database
we use MongoAtlas to store user information.<br />
This is our mongoDB connection string: mongodb+srv://Michael:1234@cluster0.30bnt.mongodb.net/WAM_Calculator?retryWrites=true&w=majority <br />
you can download MongoDB compass and type this string to connect to our database.
Our database name is: **`WAM_Calculator`**<br />
Also, you need to create a new file call `.env` in your local computer and type the following code in it:
**`MONGO_USERNAME=Michael`**<br />
**`MONGO_PASSWORD=1234`**<br />
**`PASSPORT_KEY=info30005secretkey`**</br>
This PASSPORT_KEY will allow you to use passport.js while you try to run our code.

## Instructions of Using code
clone this repository and install all the dependencies in **package.json** and type **npm start** in terminal to run the code. However, you may not be able to run these codes because you cannot access our database. If you intend to do so, we have provide one of our username and password. And you will need to set a passport key, which could be anything you want. Please refer to here: [How to access our database](#how-to-access-our-database).
