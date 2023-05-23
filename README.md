# AccessProject

How to run the website server?
- nodemon server.js

Purpose: This project is to focus on login system, hashing password, and storing information in the back-end system MongoDB.

Concept: Create some data and be able to manage inside the account

Tools:
- bcryptjs
- client-sessions
- express
- express-handlebars
- mongoose

Support Tools:
- nodemon

Direction:
Daily Reward = Reset everyday at LOCAL time | First register account can claim their daily reward immediately. (Done)
Express Handlebars = Helpers numbers separate by comma (1000 -> 1,000).
app.use(express.static("images")) - Inserting Images through hbs (Done)

Using startTime = Date.now() and endTime = Date.now(), and calculate the difference between them TimeDiff = endTime - startTime in milliseconds. (Optional)