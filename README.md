<p align="center">
	<img src="https://user-images.githubusercontent.com/30529572/92081025-fabe6f00-edb1-11ea-9169-4a8a61a5dd45.png" />
	<h2 align="center">Node.JS template</h2>
	<h4 align="center">A template to quickstart Node.JS REST APIs<h4>
</p>

![Tests](https://github.com/GDGVIT/node-template/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/GDGVIT/node-template/branch/master/graph/badge.svg)](https://codecov.io/gh/GDGVIT/node-template)

## Functionality

- Idiomatic and configurable logging
- Response compression
- Sane linting and styling guidelines
- Continuous integration using github actions
- Tests
- Code coverage

## Running the server

```bash
npm start
```

**Note**: This will run a server in the development environment.
For information on deploying an express application to production, take a look [here](https://expressjs.com/en/advanced/best-practice-performance.html).

## Logging

This directory has 2 files.

- `logger.js` exports a winston object which we use for logging. You should modify logger.js to customize your logging configuration.
- `morgan.js` exports a pre-configured morgan object to write logs using a stream to winston. It is used to intercept http requests and log the request and response details.
  For more details, visit the official page for [morgan](https://www.npmjs.com/package/morgan).

## Routes

Directory for defining routes. I don't think this needs more explanation.

## Additional Information

- On Linux, UNIX and Mac, running the following command adds ./node_modules/.bin to the path.

  ```bash
  source ./activate
  ```

  This makes it easier to run locally installed command packages.
  This won't be required in many IDEs like Webstorm, but we thought it's a good idea to include it anyway.

- [standard.js](https://npmjs.com/package/standard) has been added as the default linting and styling tool.

  Usage:

  ```bash
  npm run lint
  ```

  Formats the entire project, and logs out anything it couldn't fix.

- [mocha](https://npmjs.com/package/mocha) is used for testing and [chai](https://npmjs.com/package/chai) is used for assertion.
  [chai-http](https://npmjs.com/package/chai) is used to test http endpoints.

  Run all tests using:

  ```bash
  npm test
  ```

- [nyc](https://npmjs.com/package/nyc) is used as the default coverage tool.

  Upload coverage report to codecov using:

  ```bash
  npm run coverage
  ```

  Note: You will need to add the `CODECOV_TOKEN` to your repository secrets for GitHub actions to work well, and export it as an environment variable to run it locally.

## Dependencies

| Dependency                                           | Usage                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| [body-parser](https://npm.com/package/body-parser)   | POST body parsing middleware. Adds body object to incoming request |
| [compression](https://npmjs.com/package/compression) | Response compression middleware                                    |
| [express](https://npmjs.com/package/express)         | Express REST API framework                                         |  |
| [morgan](https://npmjs.com/package/morgan)           | HTTP request logger                                                |
| [winston](https://npmjs.com/package/winston)         | General purpose logger for the application                         |
| [nyc](https://npmjs.com/package/nyc)                 | Code Coverage tool                                                 |
| [standard](https://npmjs.com/package/standard)       | Linting and styling tool.                                          |
| [chai](https://npmjs.com/package/chai)               | Assertion Library                                                  |
| [chai-http](https://npmjs.com/package/chai-http)     | Middleware for chai to test http endpoints                         |
