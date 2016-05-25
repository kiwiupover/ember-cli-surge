# Ember-cli-surge
[![Build Status](https://travis-ci.org/kiwiupover/ember-cli-surge.svg)](https://travis-ci.org/kiwiupover/ember-cli-surge)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-surge.svg)](http://emberobserver.com/addons/ember-cli-surge)

## Static Web Publishing for Front-End Developers
[surge.sh](http://surge.sh) Zero-bullshit, single–command,
bring your own source control web publishing CDN. Yes, it's free.
[Surge Docs](http://surge.sh/help)


## Installation

From within your Ember CLI application run:

For ember-cli >= 0.2.3, run:

```sh
ember install ember-cli-surge
```

Otherwise, for ember-cli 0.1.5 - 0.2.3, run:

```sh
ember install:addon  ember-cli-surge
```

## Deployment

```sh
ember surge
```

This command will build your ember app using the production environment.
Then deploy that code from your `dist` folder
to the url `<your-project-name>.surge.sh`

Using the environment flag `ember surge --environment development` to deploy your development environment.

### Updating the Domain Name

The domain name that your project builds can update in the `CNAME` file.
Make sure your domain is `<something>.surge.sh`.
For more info look at the [Surge Docs](http://surge.sh/help/remembering-a-domain)

### Other commands
- `ember surge --login` Login to your account at Surge (surge.sh).
    - alias: `-l`
- `ember surge --whoami` Check who you are logged in as.
    - alias: `-w`
- `ember surge --publish` Publishes a project to the web using Surge (surge.sh).
    - alias: `-p`
- `ember surge --list` List all the projects you’ve published on Surge (surge.sh).
    - alias: `-ls`
- `ember surge --token` Get surge.sh authentication token, great for Continuous Integration (CI).
    - alias: `-t`
- `ember surge --logout` Log out of your account at Surge (surge.sh).


## Contributing
We would love ot hear your feedback and welcome your PRs.
Cheers.

### Running Tests

* `npm test`

## License
This software is distributed under the MIT license.
