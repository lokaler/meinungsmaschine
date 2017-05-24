#!/usr/bin/env node

'use strict';

var noodle = require('noodlejs'),
	_ = require('lodash'),
	path = require('path'),
	fs = require('fs-extra'),
	db = require('diskdb'),
	cleanDB = require(path.resolve(__dirname, './util/cleanDB')),

	config = require(path.resolve(__dirname, 'package.json')).config,

	options = {
		debug: config.debug,
		resultsCacheMaxTime: 3600000,
		resultsCachePurgeTime: 60480000,
		resultsCacheMaxSize: config.maxCacheSize
	};



var main = function() {

	db = db.connect(path.resolve(__dirname), [config.out]);
	var datastore = db[config.out];

	fs.readdir(path.resolve(__dirname, config.recipes), function(err, files) {
		if (err) console.err("Error reading the recipes at: ", config.recipes);
		else {
			files.forEach(function(file) {
				require(path.resolve(__dirname, config.recipes, file)).run(options, function(result) {
					datastore.save(result, function(err, newDoc) {
						if (err) console.log(err);
					});
				});
			});
		}
	});

};

cleanDB(config.out, function() {
	main();
});







