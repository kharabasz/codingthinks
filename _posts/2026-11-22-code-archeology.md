---
layout: post
title: "Code archeology"
date: 2026-11-22 12:00:00 +0100
categories: [ai]
description: "Your codebase knows what you did last summer."
reading_time: 4
image: /assets/images/posts/code-archeology/hero.webp
image_alt: "A developer and three small robots dig through a code archeology site, uncovering a glowing code symbol among stacks of commits, pull requests, tests and issues."
---

*Code archeology (n.): working out why code is the way it is from the evidence it left behind.*

Say an agent is asked to tidy up some code that has grown messy. It finds a check that seems to do nothing, removes it, and the tests still pass. Years ago, something happened that made that check necessary, and the only record of it is an old ticket buried by history. The change ships, and the problem the check was guarding against comes back.

Agents have made writing code cheap. Writing the right code takes work.

## Why agents raise the stakes

![A cheerful robot unscrews a safety check from a machine while the terminal shows the tests passing, a red alarm marked real issue keeps flashing, and a developer wonders whether it just removed a safety check.]({{ '/assets/images/posts/code-archeology/assumptions-vs-evidence.webp' | relative_url }})

Until it investigates your repository, an agent has to rely on general patterns and whatever project context you've provided. That isn't enough to explain every constraint in an existing system. Ask it to change a function and it'll assume the function does what functions with that name usually do; when it's wrong, the result is a hallucination: a confident claim about your system that isn't true.

In one study of repository-level code generation, about two thirds of hallucinations broke the task's requirements or project's setup (Zhang et al., 2025). Archeology helps recover the project-specific context and implicit requirements behind those mistakes. Every unresolved question in a spec is something the agent may have to infer. Closing the important ones with evidence reduces the risk of building on a wrong assumption.

## Where the evidence is

Code archeology starts with the evidence closest to what you're investigating. Work from it directly:

- read the code and the tests as they are now
- find the commit and read its message
- follow it to the pull request and its review comments
- check the feature ticket or change request it closed
- read the source of the dependencies you're calling
- capture how the running system behaves

Documentation, tribal knowledge and AI-generated summaries can help you find the evidence, but they may be incomplete or outdated. Summaries are particularly vulnerable to losing behavioral details: in a small 2026 experiment, an agent answered 27 of 45 questions when given source code, compared with just 4 when given a short natural-language summary of the same code (Sam-Bodden, 2026).

## Let the agent dig, but ask for citations

Archeology is tedious for a person and quick for an agent, so let the agent do the research. Code intelligence tools let it find definitions, references, dependencies and data flows without relying on text search alone.

Tell the agent to cite the evidence behind every finding. Anything the evidence doesn't establish should be labeled as unresolved.

![A robot presents a research report where every finding points at its evidence: a line of code, a test, a commit and a revision.]({{ '/assets/images/posts/code-archeology/cite-your-sources.webp' | relative_url }})

Check the citations behind the high-risk claims yourself and spot-check the rest.

## When the evidence runs out, run a spike

History can explain why something was built, but not always whether the original constraint still applies. A dependency might have changed, or a workaround might no longer be necessary.

When the available evidence can't settle an important question, run an isolated spike: a small, disposable experiment designed to test one assumption. State what you're trying to establish, reproduce the relevant conditions in isolation, and record the result and its limitations.

A spike doesn't prove that something will always work. It establishes what happens under specific conditions. That's often enough to replace a guess with evidence, or to identify what still needs investigation.

## Turn evidence into a spec

The result of the investigation should be a short evidence note that feeds the spec. Turn the relevant findings into explicit constraints and acceptance criteria. The goal is to leave the agent fewer consequential decisions to make without evidence.

## Write history for the next reader

Every commit message, pull request description, issue and decision record you write today becomes evidence for the next person, and increasingly, for the next agent.

![A developer at a laptop writes the history of a change while robots hold the diff and the acceptance criteria, and an arrow points to a shelf of commit messages, pull requests and decision records.]({{ '/assets/images/posts/code-archeology/write-history-for-the-next-reader.webp' | relative_url }})

Record why the change was necessary, which alternatives were considered and what behavior must be preserved. Explain important implementation choices when their rationale wouldn't be obvious from reading the code.

Avoid documenting how the code works when that information can be discovered directly from the implementation. Detailed descriptions and pseudocode become stale as the code changes, leaving future readers to reconcile competing versions of the truth.

Let an agent draft the history from the diff and the conversation behind it, but check that it accurately describes the decision.

## References

1. Zhang, Z. et al. (2025). *LLM Hallucinations in Practical Code Generation: Phenomena, Mechanism, and Mitigation.* ISSTA 2025. <https://arxiv.org/abs/2409.20550>
2. Sam-Bodden, B. (2026). *What Context Does a Coding Agent Actually Need to Act?* Preprint. <https://arxiv.org/abs/2607.09691>
