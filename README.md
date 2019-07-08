# Require Label Bot

[![Build Status][travis-status]][travis-url]

A [Probot](https://probot.github.io) bot to make sure that a given label is added
to specific issues when all other labels do not match a regex.

## Setup

Add a `.github/relabel.yaml` file to your repository and then run the bot against it.

If the config is empty or doesn't exist, the bot will not run.

```yml

# Config

requiredLabels:
    # The missing label which will be added if the regex doesn't match any other labels
  - missingLabel: needs-area
    regex: area:.*
  - missingLabel: needs-type
    regex: type:.*
```

## Contribute

If you have suggestions for how this bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

[travis-status]: https://travis-ci.org/lswith/probot-require-label.svg?branch=master
[travis-url]: https://travis-ci.org/lswith/probot-require-label
