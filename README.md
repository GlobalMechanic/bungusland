# Template

## Anatomy of this repo

* `/src`: contains the source files, from which we build the site. This will be your destination for local development. 
* `/public`: the client code for the live site. We'll build to here from the source folder.

Various files in the root are to facilitate running on Heroku. This is a basic express app.

## Local Development

Local development all happens in the source folder. We use gulp to boot up a local development server, and watch code for changes so that everything compiles all nice and speedily. 

### Initial setup

In your freshly cloned the repo run `npm install`. 

### Okay, now I want to actually develop things

## Debuggin the look and feel

Once you are setup, run `gulp serve` and the sails should be lifted. A browser tab should automatically open at `http://localhost:3000`. This will run an instance of BrowserSync for a lightning fast debug flow.

## Debugging express

For testing things like routes, you'll want to run off express using `node server`. This will launch the site on `http://localhost:5000`.

## Building & Deploying

If you would like to update `http://bungusland.herokuapp.com` to the current state of things, just:

1. Run `gulp build` from the root folder.
2. Commit your changes and push to master.

Heroku is linked to the Github master branch, and will deploy automatically.

## Ignore

If this is a copy of a template, and you're setting it up on git for the first time, this should be in the ignore file:
```
lib-cov
*.seed
*.log
*.csv
*.dat
*.out
*.pid
*.gz

pids
logs
results
build

node_modules
```