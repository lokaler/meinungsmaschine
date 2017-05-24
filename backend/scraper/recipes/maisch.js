#!/usr/bin/env node

'use strict';

var NAME = 'Maischberger';

var noodle = require('noodlejs'),
	_ = require('lodash');


exports.run = function(options, callback) {
	var baseURL = 'http://www.daserste.de/unterhaltung/talk/maischberger/',
		pagesURL = 'sendung/index.html',
		titleSelector = '.section.sectionZ>.con>.modCon>.mod>.boxCon>.box>.teaser>.headline>a';
	noodle.configure(options);
	noodle.query({
		'url': baseURL + pagesURL,
		'map': {
			'title': {
				'selector': titleSelector,
				'extract': 'text'
			},
			'link': {
				'selector': titleSelector,
				'extract': 'href'
			},
			'date':{
				'selector': '.box.viewA>.ressort',
				'extract': 'text'
			},
		}
	})
	.then(function (transmissions) {
		transmissions = transmissions.results[0].results;

		transmissions.link.forEach(function (link, i) {
			var fullURL = "http://www.daserste.de" + link;
			noodle.query({
				'url': fullURL,
				'map': {
					'name': {
						'selector': '.mediaCon.mediaLeft.small>.media.mediaA>.mediaInfo>.infotext',
						'extract': 'text'
					}
				}
			}).then(function (guests) {

				
				var names = guests.results[0].results.name;
				var date = transmissions.date[i].replace('Sendung vom ', '');

				if(names.results){
					names = [transmissions.title[i].replace(/\(\d{2}\.\d{2}\.\d{4}\)/g, '').replace("Zu Gast: ","")]
					names = [names[0].split("(")[0].trim()];
				}


				names.forEach(function(name, j) {

					var year = Number(date.split(".")[2]);

					if(year<2017){
						callback();
					}

					var result = {
						transmission: NAME,
						name: name.replace('Im Einzelgespräch: ', '').replace(' im Einzelgespräch', '').replace('zugeschaltet: ',''),
						date: date,
						title: transmissions.title[i].replace(/\(\d{2}\.\d{2}\.\d{4}\)/g, ''),
						link: fullURL
					};

					if (name.indexOf(',') != -1) {
						name = name.split(',');
						result.party = name[1].trim();
						result.name = name[0].trim();
					}



					callback(result);
				});
			});
		});
	});

	noodle.stopCache();
};