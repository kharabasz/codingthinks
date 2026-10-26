# codingthinks

Source for <https://codingthinks.com>, a Jekyll blog built and hosted by GitHub Pages.

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md` with front matter:

```markdown
---
layout: post
title: "My post"
date: 2026-10-26 12:00:00 +0100
---

Post text here.
```

Commit and push to `main`; GitHub Pages rebuilds the site in a minute or two.

## Previewing locally (optional)

Needs Ruby. Then:

```bash
bundle install
bundle exec jekyll serve
```

and open <http://localhost:4000>.
