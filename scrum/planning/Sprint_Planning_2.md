# Sprint Planning Report: Sprint _

*Copy this file into `scrum/planning/` using your team's naming format. Fill in every field. Replace the italic guidance with your team's information.*

---

## 1. Meeting Details

**Date:** 11/11/2026

**Scrum Master:** Caden McBeth

**Attendees:** Chase Lingafelt, Zeven King, Caden McBeth, Brennan Sweet, Ian Gassner

**Absent:** N/A

---

## 2. Sprint Goal

*One or two sentences describing a playable outcome, not a list of tickets. e.g., "A player can create a character and enter the first dungeon."*

A player can move their cursor using the keyboard to select options within the battle submenu, select enemies to target, and see their given reward
at the close of a battle.

## 3. Capacity and Velocity

**Sprint dates:** 11/11/2026 to 11/18/2026

**Velocity last sprint (points completed):** 6 *(Sprint 1: write "n/a")*

**Average velocity so far:** 6

**Known absences or reduced availability this sprint:** N/A

**Points committed this sprint:** 34

**Why this commitment is realistic:** *(Compare it to your velocity and capacity. If you are committing more than last sprint's velocity, explain why.)*

Our first sprint value of 22 was extremely viable, and our only issues was with pushing it to production. This sprints targeted value of 34 is much higher,
but should be accomplished with the foresight of checking everything works in production earlier than previously.

---

## 4. Committed Backlog Items

*Every item listed here must meet the Definition of Ready in your constitution. Items should be taken from the top of the product backlog in priority order. If you skipped a higher-priority item, explain why under "Notes".*

| Issue # | User story | Estimate | Owner | Ready? |
|---------|------------|----------|-------|--------|
|#74|Create Battle Submenu and Reward/Post Battle Menu Sprite Work|3-4 hours|Caden McBeth|[Y]|
|#73|Gold|1 hour|Zeven King|[Y]|
|#7|Keyboard Playable|3 hours|Ian Gassner|[Y]|
|#1|Enemies Identification|1 hour|Chase Lingafelt|[Y]|
|#4|After Combat|1 hour|Zeven King|[Y]|
|#5|Variance in Combat|5-6 hours|Brennan Sweet|[Y]|

**Total points:** 34

**Notes:** Any high priority items in our backlog that have been skipped is to a change of vision about how our MageQuest will function,
and our chosen focuses for this Sprint are at current the most important for the formation of our project.

---

## 5. Task Breakdown

*Break each story into tasks. Include tasks for writing tests and reviewing PRs, not only coding.*

### Issue #74: Create Battle Submenu and Reward/Post Battle Menu Spritework 

- [Create Spritework for Battle Option Names and Menu Backgrounds]
- [Create Spritework for the cursor, and its different forms during a battle]
- [Create Spritework for the currency, battle rewards, and the surrounding menus]

### Issue #73: Gold

- [Create a Current Gold Counter]
- [Create Logic for Gold being added and subtracted depending on circumstance]

**### Issue #7: Keyboard Playable**

- [Allow for the Keyboard to move the cursor up and down the battle menu and submenus]

**### Issue #1: Enemies Identification**

- [Allow for the player to move the cursor inbetween all of the current enemies on the battle field, for targeting reasons]

**### Issue #4: After Combat**

- [Allow for the player to see and collect the rewards given after a battle]
- [Allow for the player to see and select a next button, to progress to the following battle]

**### Issue #5: Variance in Combat**

- [Create the logic for a Random Number Generator]
- [Allow the number generator to decide enemies and amount of enemies in a battle]
- [Allow the number generator to decide amount of currency given to the player dependent on the enemies defeated]

## 6. Work Distribution

| Member | Stories owned | Points |
|--------|---------------|--------|
|Caden McBeth|1|3|
|Brennan Sweet|1|13|
|Zeven King|2|6|
|Chase Lingafelt|1|5|
|Ian Gassner|1|8|

*If the work is not balanced, explain why:*

For me (Caden), my focus is entirely art, and there for a bit more time consuming than some of the other stories, but is not as important in the grand
scheme of the project. Both Brennan and Ian have the largest workloads for this Sprint, due to what they are working on, but as long as the rest of
us are working efficiently, we should be able to help them out and split whatever workload they may have remaining.

---

## 7. Stories Split or Deferred

*Did you split any stories that were too large for one sprint, or move stories back to the backlog? List them and say why.*

N/A

---

## 8. Retrospective Follow-Through

*Which action items from last sprint's retrospective are part of this sprint's plan, and how? (Sprint 1: write "n/a")*

| Action item | How it shows up in this sprint |
|-------------|--------------------------------|
|Background and Enemy Sprites|All finalized visuals will be carried over within the project|
|Title Screen|The now functioning title screen will of course be apart of our project, but for this sprint it will be mostly unaffected|
|Play Field (Battle)|This is the main piece that will be worked on this sprint, involving getting a majority of the base battle functions working|
|Selectable Start Button|This, just like the title screen will be carried over in our project, but mostly unaffected|
|Options Menu|Same as the Title Screen and Selectable Start Button, important for the grand scheme of the project, but majorly unaffected during this sprint|

---

## 9. Risks and Dependencies

*What might stop the team from meeting the sprint goal? Which stories depend on others being finished first?*

While none of our current issues for this sprint depends directly on each other, each of us must get our specific issues done
for our sprint goal to come together as explained.

---

## 10. Checklist

- [Y] Sprint goal written
- [Y] Every committed story meets the Definition of Ready
- [Y] Every story has an owner
- [Y] Board updated: committed stories in the sprint, tasks created
- [Y] Commitment compared to velocity
- [Y] Report committed to `scrum/planning/` via pull request
