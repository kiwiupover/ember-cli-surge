# Ember-cli-surge

## Static Web Publishing for Front-End Developers
[surge.sh] (http://surge.sh/) Zero-bullshit, single–command,
bring your own source control web publishing CDN. Yes, it's free.

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

## Deploy

```sh
ember surge
```

This command will build your ember app using the production environment.
Then it will deploy your app using from the `dist` folder
to the url `<your-project-name>.surge.sh`

## Contributing

### Running Tests

* `npm test`

## License

MIT
