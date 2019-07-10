# Require Label Bot

[![Downloads][npm-downloads]][npm-url] [![version][npm-version]][npm-url]
[![Build Status][travis-status]][travis-url]

A [Probot](https://probot.github.io) bot to make sure that a given label is added
to specific issues when all other labels do not match a regex.

## Setup

Add a `.github/relabel.yml` file to your repository and then run the bot against it.

If the config is empty or doesn't exist, the bot will not run.

```yml
# This example configuration will add the `needs-area` and `needs-type` labels
# to any new issues that do not have labels matching `area:.*` or `type:.*`.
# Once the issue has the `area:.....` label added the `needs-area` label will be 
# removed from the issue.
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
[npm-downloads]: https://img.shields.io/npm/dm/probot-require-label.svg?style=flat
[npm-version]: https://img.shields.io/npm/v/probot-require-label.svg?style=flat
[npm-url]: https://www.npmjs.com/package/probot-require-label
