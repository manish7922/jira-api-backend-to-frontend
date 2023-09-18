# how to build in jira-Api

### Project Aim
The overall aim of this project appears to be creating a ticket management system that integrates with Jira. This system allows you to fetch, view,add a comment ,chnage status and update tickets from Jira within your own application. It provides a convenient interface for users to interact with Jira tickets while storing some ticket information locally in your database.

### Project description
The Jira Ticket Management System is a web-based application designed to streamline the management of Jira tickets, providing users with a centralized interface to access and manipulate ticket data.

###  Prerequisites
1.Jira Account
2.Jira API Token
3.Node.js/Npm
4.React
5.MySql with a database named `testDb`

### Required dependencies
1.Node js
a.express.js
b.axios
c.mysql2
2.React
a.bootstrap
b.react-icons
c.axios

### How to setup code
For FrontEnd -
To Setup FrontEnd follow the below mention steps -
1) cd jiraApp
2) cd jiraApp/Code/clinet
3) npm i
4) npm start

These above steps will setup your frontend part
now will go for the backend part

For Backend -
1) cd jiraApp
2) cd jiraApp/Code/server
3) npm i
4) You have to put it in the important {JIRA_API, JIRA_API_TOKEN, JIRA_PROJECT_KEY} and database in app.js.
5) JIRA_API -
Example ->   your-jira-instance.atlassian.net/rest/api/3/issue

6) JIRA_API_TOKEN  -
  Log in to your Jira account
  Click on your profile picture and select “Manage Account”
  Click on “Security” in the left-hand menu
  Click on “Create and manage API tokens”
  Click on “Create API token” and follow the prompts to generate a token"
7) JIRA_PROJECT_KEY -  
   Navigate to the Jira Dashboard
   Look for Projects
   View the Project List
   Find the Project Key

   second things ====>
   Project Settings > Details > Key

8) keep changes the database

9) nodemon app.js


###  how to run code 
For Frontend ===>
1) cd jiraApp
2) cd jiraApp/Code/client
3) npm i 
4) npm start

For Backend ===>
1) cd jiraApp
2) cd jiraApp/Code/server
3) npm i 
4) nodemon app.js

### Note ===> they will change the jira Api and jira api Token or database setup create table to changes in my code in your project
