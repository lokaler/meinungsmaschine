#!/usr/bin/env node

//Copy from will

'use strict';

var NAME = 'Illner';

var noodle = require('noodlejs'),
	_ = require('lodash');


exports.run = function(options, callback) {

	noodle.configure(options);
	
	//map make own property names

		noodle.query({
			'url':  'https://www.zdf.de/politik/maybrit-illner',
			'map': {
				'link': {
					'selector': ".box-table-inner>.teaser-title>.teaser-title-link",
					'extract': 'href'
				},
				'title': {
					'selector': ".box-table-wrap>.box-table-inner>.teaser-title>.teaser-title-link",
					'extract': 'title'
				}
			}
		}).then(function(transmissions) {

			transmissions = transmissions.results[0].results;
			// var title = transmissions.results[0].results.title;
			// console.log(transmissions.link);

			transmissions.link.forEach(function(link, n) {

				var link = "https://www.zdf.de/" + link.trim();

				noodle.query({
					'url': link,
					'map': {
						'date': {
							'selector': ".video-airing>time",
							'extract': 'text'
						},
						// 'title': {
						// 	'selector': ".section .spacer h4 a",
						// 	'extract': 'text'
						// },
						// 'subTitle': {
						// 	'selector': ".section .spacer h3 a",
						// 	'extract': 'text'
						// },
						'names': {
							'selector': "button.name-btn",
							'extract': 'text'
						}
					}

				}).then(function(showInfo) {

			

					var names = showInfo.results[0].results.names;
					var date = showInfo.results[0].results.date[0];

					names.forEach(function(name) {

						
						var year = Number(date.split(".")[2]);

						if(year<2017){
							callback();
						}

						name = name.split("(")[0].trim();

						var result = {
							transmission: NAME,
							name: name,
							date: date,
							title: transmissions.title[n].trim(),
							link: link
						};	

						

						callback(result);
					});

				});
			});

		});



	noodle.stopCache();
};

