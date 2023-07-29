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
- Daily Reward = Reset everyday at LOCAL time | First register account can claim their daily reward immediately. (Done)
- Daily Reward Bonus 20 Days stack max (Continuously Login x20) (Done)
- Shows daily reward claim bonus (Partly Done, variables to confirm changes)
- Express Handlebars = Helpers numbers separate by comma (1000 -> 1,000) and Abbreviate numbers (k,m,b).
- app.use(express.static("images")) - Inserting Images through hbs (Partly Done - Finding images)
- Add item slot - Item Boost or Instant use Item - Separate Categories = | Resource | Materials | Others etc..

Using startTime = Date.now() and endTime = Date.now(), and calculate the difference between them TimeDiff = endTime - startTime in milliseconds. (Optional)

[ ] Add Digital Clock system to the main.hbs - digital clock service js
[x] Reduce all passing variables in auth-service.js
[x] Change display Name system (req.session.update (Front end) + SQL (Back End))
[ ] How to work on a javascript time upgrade function - Upgrade_StartTime, Upgrade_DurationSecond
[ ] Change collect reward as daily mission (instead of counting time?)
[ ] Collect all resouce time stamp. currentTime - previousCollectTime = Remaining time that hasn't been collect **

-> All testing method should be use by IronMine & IronStorage first **
