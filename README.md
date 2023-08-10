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

- [x] Add Digital Clock system to the main.hbs - digital clock service js
- [x] Reduce all passing variables in auth-service.js
- [x] Change display Name system (req.session.update (Front end) + SQL (Back End))
- [x] How to work on a javascript time upgrade function - Upgrade_StartTime, Upgrade_DurationSecond
- [ ] Change collect reward as daily mission (instead of counting time?)
- [x] Collect all resource time stamp. currentTime - previousCollectTime = Remaining time that hasn't been collect **
- [x] During Upgrading, change url to collect resource /collectAllResource. Finished upgrading and reload page while link = /collectAllResource (Problem Solving). **Change the reload url to origin/account.

-> All testing method should be use by IronMine & IronStorage first **

## Check list
- IronMine
- Generate resource each second, It cannot collect more resource up to the IronMine Capacity or IronStorage Capacity
- If calculated collect resource (CCR) is more than IronMine Capacity, then CCR will be cap at IronMine Capacity
- At this point, I was arguing should I keep IronStorage since CCR might reduce to 0 either it reaches to IronMine Capacity or IronStorage Capacity

- Upgrading Building
- When user click upgrade, It will check cost materials, reduce it and add an upgrade time clock to the database server.
- using formula UpgradeTime - (Date.Now() - upgradeTimeStart) can get the remain time upgrade (RTU). When RTU is less than or equal to 0, it will refresh the page + accountData check upgrade status and update all information, and do a final UpdateOne Check. (Expand Version)
- Once click "Collect all" button, It redirects to post /collectAllResource page and it will stick with windows.location.reload() when building is finished upgrade. To resolve this, change windows.location.reload() to redirect the url page origin + "/account".

- DailyReward System
- User can claim daily rewards due to how many days that they had login, cap at 20 days
- DailyReward will depends on the days that had been login continuously, it resets to 1 day if user break the cycle.

- User/Pet Level system?
- name, level, exp, max/current health, str, dex, int

- User Inventory Bag
- To be continue

- Event or enemy System?
- To be continue


- Can use "Collect all" button to collect all Resource


## Upgrading notes pseudo code

upgrading time cost?

-Resource
```python
    building upgrade = true

    Individual Upgrade = true of false

    If there is it is true (Upgrade)

    #ex IronMine upgrade

    for loop
    if upgrade is true{
        calculate remainTime
        If Final > remainTime{
        Final = remainTime
        }
    }


    //loop refresh page
    window.setInterval('refresh()', Final);

    // Refresh or reload page.
    function refresh() {
        window.location.reload();
    }

    //Refresh page
    authData.refreshAccount

    //find the true (one or more) building upgrade
    calculate remainTime

    if(remainTime <= 0){
        individualUpgrade = false
        +BuildingUpgrade
    }else{

    }
```