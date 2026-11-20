# Sprint Planning Report: Sprint _
*Copy this file into `scrum/planning/` using your team's naming format. Fill in
every field. Replace the italic guidance with your team's information.*
---
## 1. Meeting Details
**Date:** 11/20/2026_
**Scrum Master:** Brennan Sweet_
**Attendees:** Ian, Chase, Caden, Brennan_
**Absent:** Zeven_
---
## 2. Sprint Goal
*One or two sentences describing a playable outcome, not a list of tickets. e.g.,
"A player can create a character and enter the first dungeon."*
-To Leave the game in a playable state that has a player battling enemies,
recieving rewards, and buying upgrades.
---
## 3. Capacity and Velocity
**Sprint dates:** 11/20/2026 to 12/4/2026_
**Velocity last sprint (points completed):** _35 *(Sprint 1: write "n/a")*
**Average velocity so far:** 20_
**Known absences or reduced availability this sprint:** _Zeven
**Points committed this sprint:** _
**Why this commitment is realistic:** *(Compare it to your velocity and capacity.
If you are committing more than last sprint's velocity, explain why.)*
_We are over break and some people have a lot of time to pour into the game.
---
## 4. Committed Backlog Items
*Every item listed here must meet the Definition of Ready in your constitution.
Items should be taken from the top of the product backlog in priority order. If you
skipped a higher-priority item, explain why under "Notes".*
| Issue # | User story | Estimate | Owner | Ready? |
|---------|------------|----------|-------|--------|
| 88| Create + integrate the tavern| 8| Brennan | [Y] |
| 91| Battling Enemies and a turn based system| 8|Ian | [Y] |
| 101| Create backgrounds + sprites for cliffs and Cathedral| 5|Caden | [Y] |
| 102| Create Weapons, Shields, and consumables Sprites| 3|Caden| [Y] |
| 103| Create Attack Sprite work and Animations| 3| Caden | [Y] |
| 104| Puts all finished sprites into the game, no more filler sprites| 5| Chase | [Y] |
**Total points:** 32_
**Notes:** taking on more long tasks because of break and some people have lots of availability_
---
## 5. Task Breakdown
*Break each story into tasks. Include tasks for writing tests and reviewing PRs,
not only coding.*
### Issue #88: *(Tavern in Dungeon)*
- [Make art for the Tavern and its display]
- [Create the scripts for the tavern and spending gold systems]
- [Test using oberservers to make sure spending properly works]
- [Review heavily with ian since a large part of the game relies on switching between combat and tavern]
### Issue #91: *(Battling Enemies)*
- [Create a system that tracks battling enemies, player goes first then back and forth]
- [Create a system for having enemies attack, doesn't need animations but should signify whos turn it is]
- [Test that enemies deal damage, player kills enemies, nothing breaks with enemy attacks]
- [Review heavily with Brennan since the system relies on the shop and combat relies on items]
### Issue #102: *(Drawing Weapons, Shields, and items)*
- [Create sprites for the Weapons, Shields, and items]
- [Review artwork aligns with team vision]
- [No official tests, just need to make sure everything formats properly]
### Issue #103: *(Draw Attacks + Animations for everything remaining)*
- [Create sprites for the enemies, and animations for attacks]
- [Review artwork aligns with team vision]
- [No official tests, just need to make sure everything formats properly]
### Issue #101: *(Battling Enemies)*
- [Create sprites for the remaining 2 areas, cliffs and cathedral dungeons]
- [Review artwork aligns with team vision]
- [No official tests, just need to make sure everything formats properly]
### Issue #104: *(Incorporating Art)*
- [Get rid of all place holder sprites and fully incorporate art into game]
- [Review artwork aligns with team vision and review artwork meshes together]
- [Test to make sure everything loads properly]
*(Repeat for each committed story.)*
---
## 6. Work Distribution
| Member | Stories owned | Points |
|--------|---------------|--------|
|Chase | 104| 5|
| Caden| 101,102,103| 11|
| Brennan| 88 + 91| 16|
| Ian| 91 + 88| 16|
*If the work is not balanced, explain why:*
_Caden has a lot of time to work on the art work, the tavern and combat system intertwine so even though it looks like a ton of work it really isnt as much as it seems. Chase has the least time over break and is working on the most tedious but straight forward task
---
## 7. Stories Split or Deferred
*Did you split any stories that were too large for one sprint, or move stories back
to the backlog? List them and say why.*
_We did not split any stories, but rather shared the combat and tavern stories because they rely on each other heavily. We broke the artwork stories down into many little stories so if everything isn't done its not like missing one huge task
---
## 8. Retrospective Follow-Through
*Which action items from last sprint's retrospective are part of this sprint's
plan, and how? (Sprint 1: write "n/a")*
| Action item | How it shows up in this sprint |
|-------------|--------------------------------|
| | |
| | |
---
## 9. Risks and Dependencies
*What might stop the team from meeting the sprint goal? Which stories depend on
others being finished first?*
_
---
## 10. Checklist
- [ ] Sprint goal written
- [ ] Every committed story meets the Definition of Ready
- [ ] Every story has an owner
- [ ] Board updated: committed stories in the sprint, tasks created
- [ ] Commitment compared to velocity
- [ ] Report committed to `scrum/planning/` via pull request
