#!/usr/bin/env node

'use strict';

var NAME = 'Hart Aber Fair';

var noodle = require('noodlejs'),
	_ = require('lodash');


exports.run = function(options, callback) {
	var baseURL = 'http://www1.wdr.de/daserste/hartaberfair/',
		pagesURL = 'sendungen/index.html',
		titleSelector = '.box>.teaser>a',
		dateSelector = '.con>h2.conHeadline';

	noodle.configure(options);
	noodle.query({
		'url': baseURL + pagesURL,
		'map': {
			'title': {
				'selector': titleSelector + '>.headline',
				'extract': 'text'
			},
			'link': {
				'selector': titleSelector,
				'extract': 'href'
			}
		}
	})
	.then(function (transmissions) {
		transmissions = transmissions.results[0].results;

		transmissions.link.forEach(function (link, i) {
			var fullURL = link.replace('/daserste/hartaberfair/', baseURL);
			// console.log(fullURL)
			noodle.query({
				'url': fullURL,
				'map': {
					'name': {
						'selector': '.modConStage>.modMini>.boxCon>.box>.teaser>a>.headline',
						'extract': 'text'
					},
					'date': {
						'selector': dateSelector,
						'extract':  'text'
					}
				}
			}).then(function (guests) {
				var names = guests.results[0].results.name,
					dates = (transmissions.title[i].indexOf('(') == -1) ? guests.results[0].results.date[0].replace('Sendung vom ', '') : transmissions.title[i].split('(')[1].replace(')', '');

				names.forEach(function(name, j) {

					var year = Number(dates.split(".")[2]);

					if(year<2017){
						callback();
					}

					var result = {
						transmission: NAME,
						name: name.replace('Im Einzelgespräch: ', '').replace(' im Einzelgespräch', ''),
						date: dates,
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