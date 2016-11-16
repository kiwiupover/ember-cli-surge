# Ember-cli-surge
[![Build Status](https://travis-ci.org/kiwiupover/ember-cli-surge.svg)](https://travis-ci.org/kiwiupover/ember-cli-surge)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-surge.svg)](http://emberobserver.com/addons/ember-cli-surge)
[![Code Climate](https://codeclimate.com/github/kiwiupover/ember-cli-surge/badges/gpa.svg)](https://codeclimate.com/github/kiwiupover/ember-cli-surge)
[![npm version](https://badge.fury.io/js/ember-cli-surge.svg)](https://badge.fury.io/js/ember-cli-surge)
[![](https://david-dm.org/kiwiupover/ember-cli-surge.svg)](https://david-dm.org/kiwiupover/ember-cli-surge.svg)

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

The above command will build your ember app using the production environment then deploy that code to the url `<your-project-name>.surge.sh`

By passing an environment flag `ember surge --environment development` to the ember surge command will use your development environment.

### Updating the Domain Name

The default domain name for your project is the `<your-app-name.surge.sh>`. This can befound in the `CNAME` file at the root of your project.  
Use `ember generate surge-domain <your-new-domain>` to update the domain which will update the `CNAME` file. Remember the domain name needs to be unique.

For more info check out [Surge Docs](http://surge.sh/help/remembering-a-domain)

### Other commands
- `ember surge --new-domain` Add your own domain name ie: `--new-domain="kiwis-are-great.surge.sh"` or (surge.sh) will generate a domain when no argumentment is passed in ie:`--new-domain`
    - alias: `-d`
- `ember surge --login` Login to your account at Surge (surge.sh).
    - alias: `-l`
- `ember surge --whoami` Check who you are logged in as.
    - alias: `-w`
- `ember surge --publish` (Default: true) Publishes a project to the web using Surge (surge.sh).
    - alias: `-p`
- `ember surge --list` List all the projects you’ve published on Surge (surge.sh).
    - alias: `-ls`
- `ember surge --token` Get surge.sh authentication token, great for Continuous Integration (CI).
    - alias: `-t`
- `ember surge --environment` (Default: production) The ember env you want deployed default (production).
    - alias: `-e`
- `ember surge --logout` Log out of your account at Surge (surge.sh).
- `ember surge --teardown` Tear down a published project.
    - alias: `-td`

## Contributing
We would love to hear your feedback and welcome your PRs.
Cheers.

### Running Tests

* `npm test`

## License
This software is distributed under the MIT license.
