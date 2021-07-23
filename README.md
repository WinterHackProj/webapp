**The University of Melbourne WinterHack 2021**
# Team Valkyrie
# Group Project Repository

## Table of contents
* [Team Members](#team-members)
* [Link to our website](#link-to-our-website)
* [General Info](#general-info)
* [Detailed Info](#detailed-info)
* [Frameworks and tools](#frameworks-and-tools)
* [Instructions of Using code](#instructions-of-Using-code)
* [Test account](#test-account)
* [How to access our database](#how-to-access-our-database)
* [How we achieve our calculation process](#how-we-achieve-our-calculation-process)
* [Future Improvement](#future-improvement)
* [Image Reference](#image-reference)
* [Link To the Presentation Video](#link-to-the-presentation-video)

## Team Members

| Name | Student ID| Task | State |
| :---         |     :---:      |     :---:      |          ---: |
| Yu-Wen Michael Zhang  |1089117| Authentication of users, database schema and connections|  Done |
| Nuoda Yang  |1074426| Implement the features of adding assignment scores and the calculation process|  Done |
| Hu Chen  |1207426| Adding, removing assignment task component and score representations |  Done |
| Yifei Wang  |1001686| UI Design and front-end UI development |  Done |

contributor:
* Yu-Wen Michael Zhang: **yuwenmichael** <br />
* Hu Chen: **Prestonccc** <br />
* Nuoda Yang: **NuodaY** <br />
* Yifei Wang: **andyfadai**, **shahuhuyifei** (Yifei has two accounts)<br />

## Link To Our Website
main page:
https://winterhack-valkyrie.herokuapp.com

## Link To the Presentation Video
Promotional Video: https://youtu.be/C8UdwksDbeI <br />
Presentation: https://youtu.be/-Pkdv0b_HPw <br />
## General info
The website we developed in this project is mainly used to calculate the score that the user need to achieve in every assignment based on a target overall score the user set in the application.

## Detailed info
* This website needs user to login and register so that the user can access the full functionalities. We use **passport.js** to authenticate user and use **bcrypt** to encrypt user's password, which makes our website more securer. <br />

## Frameworks and tools
* NodeJs 14.16.X
* MongoDB Atlas
* Heroku 
* Handlebar

## Instructions of Using code
Clone this repository and install all the dependencies in **package.json** and type **npm start** in terminal to run the code. However, you may not be able to run these codes because you cannot access our database. If you intend to do so, we have provide one of our username and password. And you will need to set a passport key, which could be anything you want. Please refer to here: [How to access our database](#how-to-access-our-database).

## Test account
Account email: **test@test.com** <br />
Account password: **test12345** <br />

## How to access our database
We use MongoAtlas to store user information.<br />
Here is our mongoDB connection string:<br />
`mongodb+srv://Michael:1234@cluster0.30bnt.mongodb.net/WAM_Calculator?retryWrites=true&w=majority` <br />
You can download **`MongoDB compass`** and type this string to connect to our database.
Our database name is: **`WAM_Calculator`**<br />
Also, you will need to create a new file call `.env` in your local computer so that you can use our code. Please type the following code in this file:<br />
**`MONGO_USERNAME=Michael`**<br />
**`MONGO_PASSWORD=1234`**<br />
**`PASSPORT_KEY=info30005secretkey`**</br>
This PASSPORT_KEY will allow you to use passport.js while you try to run our code.

## How we achieve our calculation process
We calculate the sum of the user's known assignment scores and determine how close the user is to it based on the target score set by the user, and calculate how many points each assignment needs to earn on average to reach the target score among the unentered or upcoming assignment scores.

Let's say there are 3 assignments in total for a subject A, one of them is known. The other two of them will be estimated to see how the target can be reached:<br />
A1: 20/30, A2: X/30, A3: Y/40, Target: 80,<br />
where X is the estimated score of A2, Y is the estimated score of A3.<br />

Step1: X+Y = Target-SumOfKnownScores = 80-20 = 60;<br />
Step2: PercentageLeft = 100-TotalPercentageOfKnownScores = 100-30 = 70;<br />
Step3: RatioA2 = PercentageA2/PercentageLeft = 30/70; RatioA3 = PercentageA3/PercentageLeft = 40/70;<br />
Step4: X = RatioA2*(X+Y) = 3/7x60 = 25.71; Y = RatioA3*(X+Y) = 4/7x60 = 34.29;<br />
Therefore, 25.71 and 34.29 are the estimated target for A2 and A3 computed by our calculator.

## Future Improvement
* Subject details (subject name, overall target score etc.) cannot be changed once you added the subject in homepage.
* Add overall WAM calculation based on the current added subjects in homepage.

## Image Reference
The favicon image is from https://www.pinterest.com.au/pin/57350595241878813/.
