# Development

This integration focuses on [Travis CI](https://www.travis-ci.com/) and is using
[Travis CI API](https://developer.travis-ci.com/) for interacting with the
Travis CI resources.

## Provider account setup

Travis CI requires a GitHub account to log in. Once you have a GitHub account,
you can link your GitHub account to Travis CI.

1. Sign up to Travis CI using your GitHub account.
2. In the dashboard, click on your icon on the top-right and select Settings.
3. In the Repositories tab, under GitHub Apps Integration, click Activate.
4. Set the repositories Travis CI will be installed on.
5. Go to the Settings tab and under API authentication, retrieve your token.

## Authentication

Provide the `TOKEN` and the `HOSTNAME` (format is: "example.travis-ci.com"). You
can use [`.env.example`](../.env.example) as a reference.
