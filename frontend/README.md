# XEnsemble-1.0 Web-App

## Description

Front-end code for the XEnsemble-1.0 web-app, bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

1. Install the Node.js package manager [yarn](https://classic.yarnpkg.com/en/docs/install/).
2. Install dependencies for the front-end code:

```shell

yarn install
```

Note that you have to [install the Python dependencies](https://github.com/PC98/XEnsemble-1.0/blob/master/README.md#installation) separately for the server code to work as expected.

## Development

```shell
yarn dev
```

This will run the Flask server and the front-end code. To use the web-app, navigate to <http://localhost:3000>.

## Features and Limitations

- The `server.py` file in the root directory of this repository is used as a simple server. The server executes `main_attack_portal_2.py`, which builds on top of `main_attack_portal.py` to generate results as expected by the GUI.
- The web-app runs one attack on one image at a time. Future work could enable support for running multiple attacks and taking input for attack parameters using autocomplete dropdowns.
- The codebase has not been configured for deployment or production mode yet.
- Front-end does not support the LFW dataset.
- `discretization` and `success_rate` evaluation metrics are not displayed since `discretization` is always `True` and `success_rate` can be inferred from the result of the single attacked image.
