TV-Scraper
==============

## Requirements
- [Node.js](http://nodejs.org/)
- [npm](https://github.com/npm/npm)

## Install
    git clone git@bitbucket.org:g-div/tv-scraper.git
    cd tv-scraper
    npm install

## Config
The configuration is located in the ```package.json```

- *debug*: If the Scraper should print debugging information to the console
- *maxCacheSize*: The maximal size of the cache in MB
- *recipes*: The folder where your Scrape-recipes are located
- *out*: The folder and the filename of the files where the results are going to get saved

## Run
    npm start