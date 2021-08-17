# Argent Userpage

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

You need NodeJS and Yarn installed.\
You need to install the dependencies and generate all the used files before running any Scripts. To do so run:

```
yarn install
```

## Available Scripts

In the project directory, you can run the following scripts. For more scripts check out the `package.json`.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

To make use of a username you would normally use that username as a subdomain. As most development environments do not support wildcard subdomains, you can overwrite the username used by providing a `?__overwriteName=<name>` query parameter. This parameter will be reset on refresh.\
You can also setup wildcard subdoimains for your development environment, [like this](https://serverfault.com/a/118589), and use ie: `<name>.argent.local` to set the username.

### `yarn test`

Runs integration AND unit tests once. Fails if one of them fails.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn e2e`

Runs end-to-end tests against chromium using playwright.

### `yarn e2e:all`

Runs end-to-end tests against chromium, firefox and webkit using playwright.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
