---
layout: post
title: "Token boxing"
date: 2026-11-01 12:00:00 +0100
categories: [ai]
description: "Why AI work needs a budget and a definition of done before it starts."
reading_time: 5
image: /assets/images/posts/token-boxing/hero.jpg
image_alt: "A retro computer showing 99% DONE, fed with coins, printing an endless loop of paper tape."
---

*Token boxing (n.): fixing an AI task's budget of tokens, money, retries or time before it starts, together with a written definition of done, and stopping to review when the budget runs out, however close the agent says it is. A play on time boxing, and the opposite of token maxing.*

I've heard from colleagues in the industry about teams spending more than $20,000 a month per person on AI, on products that were supposed to take two weeks. Six months later they still weren't shippable. Management had set the deadlines on the strength of AI hype, and the deadlines left the teams one option, which was to lean on the AI harder. The products weren't complicated. A small team with a clear idea of what done looked like could have built them, so the problem wasn't compute.

They needed a habit I've started calling token boxing. Time boxing fixes how long you'll spend on something and makes the scope fit inside it. Token boxing does the same with AI effort: you decide what you're willing to spend and how you'll check the result, and when the budget is gone you stop and look at what actually exists before deciding whether to spend more.

The opposite is token maxing, which treats consumption as a stand-in for productivity. Agents loop overnight with no stopping rule, and every stalled task gets the same answer: run it again.

![Token maxing: a robot stuck in a run, tweak, run again loop while the cost keeps climbing. Token boxing: set a budget, work within the box, verify with an outside check, then a person decides to continue, change approach or stop.]({{ '/assets/images/posts/token-boxing/maxing-vs-boxing.jpg' | relative_url }})

Token maxing fails twice. The machine can keep generating without getting closer to a correct result. The person running it can keep feeling close to success without evidence that they are. Under unbounded iteration, the feeling of being nearly done and the evidence of being done drift apart, and nothing in the loop pulls them back together. Token boxing adds a checkpoint where someone has to compare them.

## The machine loop

![A smiling robot that wrote the code, wrote the tests, ran them and graded the results stamps PASS on its own test sheet, while the actual product lies broken under the desk. The caption reads "Independent verification."]({{ '/assets/images/posts/token-boxing/machine-loop.jpg' | relative_url }})

A language model predicts what text is likely to come next, and likely isn't the same as correct. An iteration can break a requirement nobody wrote down, hide a bug or simply be wrong, and running the model again gets you another result, which may or may not be a better one.

Left alone, an agent loop fails in ways you learn to recognise. An early wrong assumption becomes the foundation for everything built after it. The agent that wrote the code also writes the tests that judge it, so it grades its own homework. When it controls the evidence too, it can game it: in a 2026 Microsoft Research study, autonomous agents cheated by reward-hacking in 30.5% of open-ended research tasks (Huang et al.). Meanwhile the bill keeps growing, because nothing in the loop says stop.

The way out is a check the agent doesn't control. Iteration raises your chance of finding a solution, and the outside check tells you whether the one in front of you is right. Even then, the check only confirms what the specification says, so a wrong spec still passes.

That handles the machine. The second loop runs through the person at the keyboard.

## The human loop

![A developer leans in towards a slot machine labelled ONE MORE RUN, its reels showing 19/20, 20/20 and 19/20 under a SO CLOSE! sign, with a stack of API tokens beside the RUN AGAIN button.]({{ '/assets/images/posts/token-boxing/human-loop.jpg' | relative_url }})

You've probably been here. Nineteen of twenty tests pass, and one more run should do it. The next run fixes that test and breaks two others. Then it's twenty of twenty, with one test quietly weakened, and then nineteen again. Every result looks close, and being close keeps you going.

Gambling research calls this a near-miss, and near-misses make people want to keep playing (Clark et al., 2009). Nobody has shown the same effect in agent loops, and nineteen of twenty can be a real sign that one more run is worth it. The problem is carrying on when the evidence of progress is weak or comes only from the agent.

If the effect does carry over, the two loops feed each other. The agent's confident progress reports supply the near-misses, and each near-miss keeps the person spending time, attention and money on the next run. The cycle can keep going long after the work has stopped getting closer to done.

## How to token box

![A conceptual chart, "Feels almost done vs. actually done": over 40 agent runs, the agent's reported progress climbs to 99% while independently verified progress reaches only 27%, with a marker where the token box ends at run 35.]({{ '/assets/images/posts/token-boxing/how-to-token-box.jpg' | relative_url }})

Habits are cheapest to deal with before they form, because breaking one can take months or even years. People and organisations are forming their AI habits right now. If the habit is "when it doesn't work, throw more tokens at it", it will settle into how teams plan, what managers promise and what budgets assume. Token boxing is the habit to form instead, and it comes down to three moves:

First, define done. Write acceptance criteria that someone other than the agent can check, and mark ambiguous requirements as ambiguous instead of letting the agent settle them quietly.

Second, set the box and treat it as a checkpoint. Limit tokens, cost, retries and runtime. When the budget runs out, a person decides whether to continue, change approach or stop based on the definition of done; topping up automatically is token maxing again. Box after box with no verified progress means the spec or the approach is wrong. At $20,000 a month per person, a box reviewed at the end of week two would have raised that question five months earlier. Set deadlines a bounded budget can meet.

Third, keep the evidence away from the worker. Use tests, builds and evaluation data the agent can't edit, and report what has been verified and what it cost, rather than what the agent says it finished. An interface that says "almost there!" feeds the human loop; one that shows failed checks and running cost interrupts it.

Sometimes the right box is a large one. What matters is that someone chose its size before the work began, and that when the budget runs out, a person looks at what has been built and decides whether to spend more.

## References

1. Huang et al. (2026). *Reward Hacking Challenges Oversight of Autonomous Research Agents.* Microsoft Research. <https://www.microsoft.com/en-us/research/publication/reward-hacking-challenges-oversight-of-autonomous-research-agents/>
2. Clark et al. (2009). *Gambling near-misses enhance motivation to gamble and recruit win-related brain circuitry.* Neuron. <https://pubmed.ncbi.nlm.nih.gov/19217383/>
