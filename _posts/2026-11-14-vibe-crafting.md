---
layout: post
title: "Vibe crafting"
date: 2026-11-14 12:00:00 +0100
categories: [ai]
description: "How to keep the speed of vibe coding and get software you can maintain."
reading_time: 8
image: /assets/images/posts/vibe-crafting/hero.webp
image_alt: "Vibe coding: a developer and a robot tumble through tangled code and error pop-ups. Vibe crafting: a calm developer at a desk under cards for decisions, tests and guardrails while the robot builds."
---

*Vibe crafting (n.): building software with an AI agent, within decisions made by a person, with guardrails that check whether the result follows them.*

Andrej Karpathy named vibe coding in February 2025, describing a way of working where you "fully give in to the vibes" and stop reading the code. You describe what you want, accept every change, paste errors back and keep going until it looks right. For a weekend prototype that's a fine way to work. Vibe coded has also become shorthand for software that looks finished but may not hold up. That becomes a problem once people depend on it.

Steve Cosman calls the alternative vibe crafting: you hand off the writing of the code and keep responsibility for its quality. You still let the agent work fast, but you decide what it can change, what it must preserve and how the result gets checked.

I've been working this way on my own projects, and I didn't build the setup in one go. I added the pieces in roughly this order, each one making the next useful.

![A simple model for confident changes: decisions set how the software must be structured, specifications set what each change must accomplish, and guardrails and tests check compliance and correctness.]({{ '/assets/images/posts/vibe-crafting/simple-model.webp' | relative_url }})

## 1. Write the decisions down

![A developer pins decision cards to a board: "Modular monolith" and "Applied migrations are never edited" marked checked, "Each module owns its schema" marked prompt only, while rejected options such as microservices and a shared schema sit in the bin.]({{ '/assets/images/posts/vibe-crafting/write-the-decisions-down.webp' | relative_url }})

Language models are non-deterministic. Give an agent the same task twice and you can get two different designs, so gaps in the instructions can lead to different decisions from one session to the next. The first step is to close the gaps that matter. Write each structural decision as an architecture decision record: one decision per file, stated as a sentence, with a short context and its consequences. "The backend is a modular monolith." "Each module owns its schema." "Applied migrations are never edited."

Two habits keep the records useful. Each decision lives in exactly one place, so it can't drift between copies. And each record has a line saying how it's enforced: a hook, a test, CI, a reviewer, or "prompt only". The line shows which rules hold because something checks them and which hold only as long as the agent remembers to follow them.

The instructions file the agent reads at the start of every session then shrinks to facts that don't belong in decision records, such as commands, URLs and ports, plus a list of deliberate deviations, each citing the record it breaks and why.

## 2. Turn the decisions into guardrails

Writing decisions down gives the agent something to follow. It doesn't make the agent follow them. Move every rule you can out of the prompt and into something that runs: a hook that gates a tool call, a test, a lint rule or a script. A rule that runs as code no longer depends on the agent remembering it. Guardrails should fail safe: when a hook can't tell whether a command is safe, it asks the person before anything runs.

A guardrail can also pass without checking anything. An architecture test that scans for modules passes when the scan finds nothing, so after a folder is renamed the rule stays green. Every rule that scans code should fail when its scan comes back empty, and every guardrail should have a test that feeds it a bad example and confirms it fails.

## 3. Write the tests first

![A spec and its approved tests sit locked behind glass, and a stop sign blocks the robot's eraser, so it builds the code to pass them.]({{ '/assets/images/posts/vibe-crafting/tests-first.webp' | relative_url }})

Guardrails keep the implementation inside the architecture. Tests check whether it does what it was supposed to do. When an agent writes tests after the code, they can end up describing what the code does rather than what it should do. A mistake in the code can then become a mistake in the tests. So write the tests first, from the spec: the goal and acceptance criteria written down before any work starts. Each testable acceptance criterion becomes at least one failing test before any implementation exists, at the layer that can see the rule. The person reviews these tests, because they turn the testable parts of the spec into something a machine can check.

Then freeze them. Once implementation starts, a hook denies edits to the approved tests, and CI fails when one has changed or disappeared. The implementation's job is to make them pass as written. It can add tests for details the spec doesn't cover.

Sometimes a test turns out to be wrong, or the requirement can't be met as written. That's a change to the requirements, and the agent doesn't get to make it. It stops and takes the question to the person, with the failing test, what it found and the options it sees. The person updates the spec, the tests change to match it, and only then does the implementation continue.

## 4. Make the unit of work small

![An issue, a branch, a pull request and a session move along a conveyor belt, while a context router hands the robot only the frontend folder out of backend, data, frontend, testing and workflow.]({{ '/assets/images/posts/vibe-crafting/small-work-small-context.webp' | relative_url }})

Even with rules and tests in place, a large change is hard to control, so shrink the work they apply to. Every change starts from an issue with a goal, a design and acceptance criteria. One issue gives one branch, one pull request and one session.

An unrelated bug found along the way becomes a new issue instead of an inline fix, so a pull request stays about one thing and the bug gets a proper look.

A session ends with its issue. Rolling into the next issue carries unnecessary context along, making later requests more expensive and harder to keep focused.

## 5. Load only the context the work needs

With dozens of decision records, loading them all at the start of every session would bury the task. Instead, index the records by area: backend, data, frontend, testing, workflow and environments. A small router decides which instructions to load. Knowledge for an area loads when the agent touches files in that area, and a full record opens only when the work needs it.

The same applies to reading code. Searching a code base from the main session fills its context with every match. A small, cheap search agent can answer one question, such as where something is defined or which files a change touches, and return paths, line numbers and short excerpts. A hook in the main session denies broad searches and points at that agent.

## 6. Split the roles

![A search agent and a build and test agent work on their own tasks while the developer plans and reviews, and the merge and deploy buttons sit behind a locked bar marked final approval, human only.]({{ '/assets/images/posts/vibe-crafting/split-roles-keep-control.webp' | relative_url }})

Keep planning and review in the main session, where the design and decisions live. The build, test and fix loop is mostly shell commands and their output. It needs the relevant decisions, not the entire planning conversation. Hand it to a subagent with a brief that names the issue, the files to change and what done looks like. The subagent iterates on a cheaper model until CI is green or it hits a question it can't resolve within the given design. In that case, it returns the question with the options it sees. Otherwise it returns a short report.

Use a script instead of a model wherever a script can do the job. A verify script that commits, pushes, waits for CI and prints only the failures replaces a dozen turns of an agent polling and reading logs. Model choice follows the role: cheap models for searching and iterating, the strongest one for planning and review.

## 7. Review against the decisions

A reviewer that starts from the whole diff spends most of its effort finding the right code and rechecking what the tests and linters already check. Plan the review with a script instead. It maps each changed file to the decisions that govern it, so the review covers only those files and those decisions. The reviewer focuses on what the tests and linters can't check, instead of repeating what they already enforce.

Most changes need one reviewer. A change that can lose data or weaken security gets more: several reviewers on different models, each working on its own, because different models catch different things. Findings reported by a majority, the quorum, block the change. Findings from a single model are flagged separately, but a serious one can also block until a person reviews it.

## 8. Keep a human in the loop

Machines can check whether code follows the decisions. They can't take responsibility for whether those decisions are right. So a person decides what to build and what done means, approves the tests, answers the questions the agent stops on, and makes the calls that are hard to undo, such as merging, deploying or touching real data. A hook stops the agent from merging or pushing to the main branch.

Make each of these quick for the person. When the agent asks a question, it brings the options and what it found. When work is ready, it says what was checked and what the reviewers found. The person then tries the change on a running build with realistic data, and doesn't need to read every line of the diff.

## 9. Feed every miss back in

![A bug card leads to a guardrail card and then to a green check on the screen, while the developer and the robot look on and a seedling labelled "Start small" grows on the desk.]({{ '/assets/images/posts/vibe-crafting/feed-every-miss-back-in.webp' | relative_url }})

Something will still get through. When it does, put the fix where it'll catch the next one. A bug becomes an issue. A rule the agent broke moves from "prompt only" to a hook or a test, and the record's enforcement line changes with it. When something bypasses a guardrail, fix the guardrail and add a test that proves the gap is closed. Over months, more of the rules move out of the prompt and into code, and the agent has fewer decisions left to make up.

## Where to start

You don't need all nine steps on day one. Pick the three structural decisions you're most tired of watching the agent make differently, and write each one as a short record. Then pick the one that hurts most when it's broken and write a check that fails the build when the rule is violated. Mark the other two "prompt only" until you get to them. Add the next step only when the current one works reliably.

## References

1. Karpathy, A. (2025). Post introducing "vibe coding". <https://x.com/karpathy/status/1886192184808149383>
2. Cosman, S. (2026). *Vibe Crafting: an agent skill for spec-driven development.* <https://github.com/scosman/vibe-crafting>
