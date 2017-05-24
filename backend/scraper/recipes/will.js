#!/usr/bin/env node

'use strict';

var NAME = 'Anne Will';

var noodle = require('noodlejs'),
	_ = require('lodash');


exports.run = function(options, callback) {
	var baseURL = 'http://daserste.ndr.de/annewill/',
		overviewURL = baseURL + 'archiv/erste318_glossaryPage-';

	noodle.configure(options);
	noodle.query({
		'url': overviewURL + '1.html',
		'selector': '.controls.paging>.pageswitch>ul>li.page>a',
		'extract': 'text'
	}).then(function(pages) {

		var lastPage = parseInt(_.last(pages.results[0].results));

			// pages = _.range(lastPage);
			pages = [ 1, 2, 3,];


		var dateSelector = '.mod.modA.modClassic .dachzeile',
			titleSelector = '.mod.modA.modClassic h4.headline';

		

		_(pages).forEach(function(page) {


			noodle.query({
				'url': overviewURL + page + '.html',
				'map': {
					'date': {
						'selector': dateSelector,
						'extract': 'text'
					},
					'title': {
						'selector': titleSelector,
						'extract': 'text'
					},
					'link': {
						'selector': titleSelector + '>a',
						'extract': 'href'
					}
				}
			}).then(function(transmissions) {


				transmissions = transmissions.results[0].results;
				_(transmissions.link).forEach(function(link, n) {

					var fullURL = link.replace('/annewill/', baseURL);
					noodle.query({
						'url': fullURL,
						'selector': titleSelector + '>a',
						'extract': 'href'
					}).then(function(guestsOverview) {

						guestsOverview = guestsOverview.results[0].results[0];
						noodle.query({
							'url': guestsOverview.replace('/annewill/', baseURL),
							'map': {
								'name': {
									'selector': '.mediaInfo>.infotext',
									'extract': 'text'
								},
								// 'nameWithParty': {
								// 	'selector': 'h3.subtitle.small',
								// 	'extract': 'text'
								// },
								// 'position': {
								// 	'selector': 'p.text.small strong',
								// 	'extract': 'text'
								// }
							}

						}).then(function(guests) {

							var names = guests.results[0].results;

							_(names.name).forEach(function(guest, i) {

								var date = transmissions.date[n].split('|')[0].trim();
								var day =  Number(date.split(".")[0]);
								var month =  Number(date.split(".")[1]);
								if(month < 10){month = "0" + month }
								if(day < 10){day = "0" + day }
								var year = Number(date.split(".")[2]);

								if(year<17){
									callback();
								}

								var dateWithFullYear = day + "." + month + "." + "20" + year;

								// var	party = _.compact(guests.results[0].results.nameWithParty)[i];

								// if (party.indexOf('(') !== -1) {
			
								// 	var partyClean = party.substring(party.lastIndexOf("(")+1,party.lastIndexOf(")"));;
			
								// }

								var result = {
									transmission: NAME,
									name: guest.trim(),
									date: dateWithFullYear,
									title: transmissions.title[n],
									link: fullURL
								};

					
								// if(result.data.split(".")[2]=="17"){
								// 	console.log("HI")
								// }


								// if (!_.isEmpty(party)) result.party = partyClean.trim();
							
								callback(result);
							});
						});
					});
				});

			});
		});
	});

	noodle.stopCache();
};