# bmt-spa-app

A prototype for creating single page applications based on "mean" stack. 

## Key features:

 - responsive layout;
 - dynamic routes, templates and side menu for big application;
 - JSON Web Token (JWT) authentication;
 - dynamic changing localization;
 - building all client *.js files into one app.js with IIFE wrapping each file's contents. 

## Stack of technologies
***

### Backend RESTful API server:
 - Node.js
 - Express
 - database - MongoDB
 - authentication - JSON Web Token (JWT)
    
### Front-end Angular single page application:
 - AngularJS - core of application
 - Bootstrap and AngularUI
 - Angular ui-router - using for routing
 - Angular-translation for localization
 
### Testing and maintaining:
 - all frameworks and libraries for unit and e2e testing are included in the "devDependencies" of the package.json file
 - gulp - for building angular app
 - grunt - for automation repetition operations
 - mongoose-data-migrate (installed globally) - for initial database migrations
 
## Installation

***

### Install Node.js
### Install MongoDB
### Install global modules with `npm`:
 * `npm install -g bower`
 * `npm install -g node-gyp`
 * `npm install –g mocha`
 * `npm install -g karma-cli`
 * `npm install -g grunt-cli`
 * `npm install -g gulp`
 * `npm install -g protractor`
 * `webdriver-manager update`
 * `npm install -g mongoose-data-migrate`
 
### Install local modules with:
* `npm install`

### Install local modules with `bower`:
* `bower install`

### Configure env files in `/config/env/*` according to environment requirements

### Make initial migration (`env` - environment parameter: `production`, `development`, `test`):
* for windows: `set NODE_ENV=env&&mongoose-data-migrate up`
* for linux: `NODE_ENV=env mongoose-data-migrate up`

### For building production app:
* run `gulp`

### For running tests (only several base tests provided):
* for all type of tests, run `grunt test`
* see `gruntfile.js` for different tasks  