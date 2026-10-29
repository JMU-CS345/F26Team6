# Team Constitution

*This document records how our team works together on Mage Quest. Fill in every field. Replace the italic guidance with your team's decisions. Changes to this document go through a pull request like any other change.*

---

## 1. Team and Roles

### Team 6

### Team Name

_

### Members

| Name  | GitHub username | Usual availability |
|------ |-----------------|--------------------|
|Ian    | igassner        |                    |
|Chase  | ChaseLingafelt  |                    |
|Brennan| BrennanSweet556 |                    |
|Zeven  | ZKing07         |
|Caden |  cmcbeth330      |                    |

### Scrum Master

**Sprint 1 Scrum Master:** _

**Does the role rotate?** *(e.g., rotates each sprint in the order listed above; or one person for the whole project)*
Yes it rotates
_

### Product Owner

*Choose one team member who will interact with the instructor (stakeholder) to clarify and prioritize stories, and to collect new ones.*
Zeven
_

### Other Responsibilities

Who is responsible for maintaining the project board / backlog in good order? *(Scrum Master?)* Scrum master

Who is responsible for deploying the main branch to production to update GitHub pages? Scrum master

### Decision Making

*(How do we decide things: consensus, majority vote, Scrum Master decides? What happens if we are deadlocked?)*
majority vote. coin toss if deadlocked.
_

---

## 2. Scrum Process

### Sprint Length and Dates

| Sprint | Start | End | Review / Retro date |
|--------|-------|-----|---------------------|
| 1 | 11/2 | 11/8 | 11/9 |
| 2 | 11/9 | 11/15 | 11/16 |
| 3 | 11/16 | 11/29 | 11/30 |
| 4 | 11/30 | 12/6 | 12/7 |
| 5 | 12/7 | presentation day | presentation day | 

### Meetings

| Meeting | When |
|---------|------|
| Daily standup | Wed/Fri |
| Sprint planning | Mon |
| Sprint review | Mon |
| Sprint retrospective | Mon |


_

### Definition of Ready

*A backlog item may be pulled into a sprint only when:*

- [ ] it is written as a user story
- [ ] it has acceptance criteria
- [ ] it has an estimate

### Definition of Done

*An item is done only when:*

- [ ] code is reviewed and approved by at least one teammate
- [ ] all tests pass in CI
- [ ] merged to `main`
- [ ] works in the deployed build
- [ ] the issue is closed
- [ ]

### Estimation

**Method:** *(story points, t-shirt sizes, hours)*

**Scale:** *(e.g., 1, 2, 3, 5, 8, 13)*

_

### Backlog and Board

**Where the backlog lives:** *(GitHub)*

**Board columns:** *(To Do → In Progress → In Review → Done)*

_

---

## 3. Communication

### Primary Channel

**Channel:** *(Text)*

**Expected response time:** *(within 12 hours on weekdays and weekends before 8pm)*

### What Goes Where

*(What is discussed in the chat channel vs. in GitHub issues vs. in PR comments?)*
Mainly texting but code related stuff in comments.
_

### Reporting Blockers or Falling Behind

*(How and how early does a member tell the team they are stuck or behind?)*
Issue dependent but as soon as the person realizes they are falling behind.
_

### Absences

*(How much notice is required? How is the absent member's work covered?)*
Notify as early as possible. Split up if possible or if absent member can work from home.
_

---

## 4. Git and GitHub Workflow

### Branch Naming

**Format:** *(`type/issue-short-description`)*

**Allowed types:** *(e.g., `feature`, `fix`, `docs`, `refactor`, `test`, `chore`)*

**Examples:**
feature/movement
-
-

### Branch Protection on `main`

- [ ] No direct pushes to `main`
- [ ] Required approvals before merge: 2
- [ ] CI must pass before merge
- [ ] Same protection on `production`

### Commit Messages

*(Format and style, e.g., imperative mood: "Add rune puzzle validation". Do we follow Conventional Commits?)*

_

### Pull Requests

**Maximum size:** *(e.g., aim for under 300 changed lines)*

**Description template:** *(e.g., What / Why / How to test / Screenshot)*

**Linking issues:** *(e.g., every PR includes `Closes #N`)*

_

### Code Review

**Review turnaround:** *( 24-48 hours of being requested)*

**Who reviews what:** *(e.g., any teammate)*

_

### Merging

**Merge style:** *(squash and merge)*

**Who merges:** *(the author after approval)*

**After merge:** *(delete the branch)*

_

---

## 5. Code Conventions

### Naming

| Kind | Convention | Example |
|------|------------|---------|
| Variables and functions | | |
| Classes | | |
| Constants | | |
| Files | | |
| Test files | | |

### Formatting

**Indentation:** *(tabs)*

**Semicolons:** *(sometimes)*

**Quotes:** *(double)*

**Maximum line length:** _100

**Tools:** *(e.g., Prettier and ESLint, with config files committed to the repo)*

_

### Project Structure

*(Where does each kind of file live?)*

```
src/
  model/        (e.g., game logic, no p5 drawing calls)
  view/         (e.g., drawing code)
  controller/   (e.g., input handling)
assets/
spec/
```

### Architecture Rules

*(e.g., game logic never calls p5 drawing functions directly, so it can be unit tested)*

-
-

### Comments and Documentation

*(When are comments or JSDoc required?)*

_

### Assets

**File naming:** *(e.g., all lowercase, hyphens, no spaces)*

**Licensing and attribution:** *(Where do we record the source and license of art, sound, and fonts we did not make?)*

_

---

## 6. Testing and Quality

**Test framework:** Jasmine

**Where tests live:** _

**What must have tests:** *(e.g., all model code; every bug fix gets a test that reproduces it; combat and puzzle rules)*

_

**Coverage expectations:** 90+%

**Continuous integration:** *(What does GitHub Actions run on each PR?)*

_

**Rule for failing CI:** *(e.g., nothing merges while CI is red)*

_

**Manual playtesting:** *(Who plays the build before each sprint review, and how are bugs reported?)*
The scrum master. Bugs reported through text. 
_

---

## 7. Deployment

**Where the game is deployed:** GitHub Pages, URL here

**What triggers a deploy:** *(e.g., a release PR from `main` into `production`, opened by the Scrum Master after each sprint review)*

**Who checks the deployed build, and when:** _

---

## 8. AI Tool Usage

**Allowed tools:** _all of them

**Allowed uses:** *(e.g., code generation, tests, documentation, review)*

_

**Not allowed:** _

**Disclosure:** *(e.g., note AI assistance in the PR description)*

_

**Responsibility:** *(whoever submits AI-generated code must understand it and is accountable for it)*

_

---

## 9. Working Agreements and Conflict

### Expected Effort
3 hours a week/ assignment gets done
*(Hours per person per week.)*

_

### Fair Contribution

*(What counts as contributing, and how is it tracked? e.g., PRs merged, reviews done, story points completed.)*
authoring code and reviewing
_

### Conflict Resolution

*(What steps do we follow when there is a disagreement or a problem with a teammate?)*

1. *(e.g., talk to the person directly)*
2. *(e.g., raise it at the retrospective)*
3. *(e.g., Scrum Master mediates)*
4. *(e.g., escalate to the instructor)*
5. talk it out with the teamate
6. bring it to the group
7. then bring it to the teacher

### Missed Commitments

*(What happens when a member repeatedly misses commitments?)*
they have to handwrite apologies
_

### Amending This Constitution

*(How can this document be changed? e.g., proposed by PR, approved by team vote at a retrospective.)*
Put it up to a vote.
_

---

## 10. Sign-Off

*By signing, each member agrees to follow this constitution.*

| GitHub name   | Signature (type your name) | Date |
|---------------|----------------------------|------|
| igassner      | Ian                        |10/28/2026|
|brennansweet556| Brennan                    |10/28/2026|
|ChaseLingafelt | Chase                      |10/28/2026|
|ZKing07        | Zeven                      |10/28/2026|
|cmcbeth330     | Caden                      |10/28/2026|
