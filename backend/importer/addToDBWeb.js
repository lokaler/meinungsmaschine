var pg = require('pg');
var fmt = require('underscore.string').sprintf;
var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var json2csv = require('json2csv');


//Querry
var conString = "postgres://<user>:<password>@<host>/<database>";



var client = new pg.Client(conString);

//Data
var parsedJSON = require('../scraper/data/results.json');


//Get the SQL Querry
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var abfrage = require("./abfrage.txt");


//Counter
var counter = 0;


var tpl = _.template(abfrage);

//Extras for querries
var maischberger = "AND sendungart = 'Maischberger'";
var illner = "AND sendungart = 'Illner'";
var hart = "AND sendungart = 'Hart Aber Fair'";
var will = "AND sendungart = 'Anne Will'";

//Querries
var queryAll = tpl({show: null});
var queryMaischberger = tpl({show: maischberger});
var queryIllner = tpl({show: illner});
var queryHart = tpl({show: hart});
var queryWill = tpl({show: will});

var extraDataJSON = {};
var finalJSON = {};
finalJSON.gaesteData = [];
finalJSON.shows = [];









// Sort Themen

    //Sort function
    var sort_by = function(field, reverse, primer){
       var key = primer ? 
           function(x) {return primer(x[field])} : 
           function(x) {return x[field]};
       reverse = [-1, 1][+!!reverse];
       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         } 
    }

countFunkton = function(myArray, laenge){

    // //Sort Data by amount of time present at shows
    // var dataSortedByAmountOfTimes = newData.sort(sort_by('times', false, function(a){return a}));

    var newData = [];
    var newnewnewData = [];

    myArray.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i] != current) {
            if (cnt > 0) {
                newData.push({"name": current.toString(), "times": cnt, })
            }
            current = myArray[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        newData.push({"name": current.toString(), "times": cnt, })
    }

    //Sort by times
    newData.sort(sort_by('times', false, function(a){return a}));

    //Get top ten
    for (var i = 0; i < laenge; i++) {
      newnewnewData.push(newData[i]);
    }

    return newnewnewData;

}









async.series([

  //Add Things to the DB
  function(callback){

    client.connect(function(err) {

      async.each(parsedJSON, function(neuerEintrag) {

        //Data Person
        var name = neuerEintrag.name.replace(/'/g, '');
        var job = "xxxxxxxxxx kein Eintrag xxxxxxxxxx";
        if (neuerEintrag.position != null){
          job = neuerEintrag.position.replace(/'/g, ' ');
        };
        var partei = "";
        if (neuerEintrag.party != null){
          partei = neuerEintrag.party.replace(/'/g, '');
        };
        var sex = "x";

console.log(neuerEintrag.transmission,  neuerEintrag.date)


        //Data Sendung
        var sendungThema = neuerEintrag.title.replace(/'/g, '"');
        var sendungArt = neuerEintrag.transmission.replace(/'/g, '"');
        var sendungLink = neuerEintrag.link;
        var sendungDatum = neuerEintrag.date;   //1999-01-08
          if (neuerEintrag.date.length == 10){ 
            sendungDatum = (neuerEintrag.date.slice(0,6)).toString() + (neuerEintrag.date.slice(8,10)).toString();
          };
          var year = sendungDatum.slice(6,8);
          var month = sendungDatum.slice(3,5);
          var day = sendungDatum.slice(0,2);
        sendungDatum = "20" + year + "-" + month + "-" + day;





        //Avoid old data to be added before 01.11.2013

        //if (year < 13 || (year == 13 && month != 12)){
        if (year < 14){
          counter++;
          if (counter == parsedJSON.length){
            callback(null, 'new Data Added');
          }
        }

        else{



          //1. Querry Add Info about Person if it doesn't exist yet
          var firstQuerry = fmt("INSERT INTO personen (name, job, partei, sex) SELECT '%s', '%s', '%s', '%s' WHERE NOT EXISTS ( SELECT * from personen WHERE name = '%s');", name, job, partei, sex, name);

          client.query(firstQuerry, function(err, resultOne) {

            if(err) {return console.error('error 1 query', err, name, sendungThema);}

            //2. Querry Get the Id of the Person
            var secondQuerry = fmt("SELECT id FROM personen WHERE name ='%s'", name);

            client.query(secondQuerry, function(err, resultTWo) {

              if(err) {return console.error('error 2 query', err);}
              var idperson = resultTWo.rows[0].id;

              // 3.Querry create a row for the show
              var thirdQuerry = fmt("INSERT INTO shows (sendungThema, sendungArt, sendungDatum, sendungLink) SELECT '%s', '%s', '%s', '%s' WHERE NOT EXISTS ( SELECT * from shows WHERE sendungLink = '%s');", sendungThema, sendungArt, sendungDatum, sendungLink, sendungLink);
              client.query(thirdQuerry, function(err, resultThree) {
                if(err) {return console.error('error 3 query', err, name, sendungLink);}

                  //4.Querry Get Show Id
                  var fourthQuerry = fmt("SELECT id FROM shows WHERE sendungLink ='%s' ", sendungLink);
                  client.query(fourthQuerry, function(err, resultFour) {
                  if(err) {return console.error('error 4 query', err);}

                    var idshow = resultFour.rows[0].id;

                    //5.Make a many to many realtionship
                    var fifthQuerry = fmt("INSERT INTO psrelation (idperson, idshow) SELECT '%s', '%s' WHERE NOT EXISTS ( SELECT * from psrelation WHERE idperson = '%s' AND idshow = '%s');", idperson, idshow, idperson, idshow);
                    client.query(fifthQuerry, function(err, resultFive) {

                      if(err) {return console.error('error 5 query', err);};

                      counter++;

                      if (counter == parsedJSON.length){
                        callback(null, 'new Data Added');
                      }

                    });
                  
                  });

              });

            });

          });

        };
        
       });

      // callback(null, 'Daten einlesen übersprungen');

    });

},
function(callback){
  client.query(queryAll, function(err, result) {
    if(err) {return console.error('error query', err);}
    extraDataJSON.alle = result.rows[0];
    console.log(extraDataJSON.alle)
    extraDataJSON.alle.frauenProzent = (Number(result.rows[0].frauengeastegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.alle.maennerProzent = (Number(result.rows[0].maennergaestegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.alle.name = "alle";
    extraDataJSON.alle.schlagwort = countFunkton(extraDataJSON.alle.schlagwort, 10);
    callback();
  })
},
function(callback){
  client.query(queryWill, function(err, result) {
    if(err) {return console.error('error query', err);}
    extraDataJSON.will = result.rows[0];
    extraDataJSON.will.frauenProzent = (Number(result.rows[0].frauengeastegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.will.maennerProzent = (Number(result.rows[0].maennergaestegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.will.name = "Anne Will";
    extraDataJSON.will.schlagwort = countFunkton(extraDataJSON.will.schlagwort, 1);
    callback();
  })
},
function(callback){
  client.query(queryMaischberger, function(err, result) {
    if(err) {return console.error('error query', err);}
    extraDataJSON.maischberger = result.rows[0];
    extraDataJSON.maischberger.frauenProzent = (Number(result.rows[0].frauengeastegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.maischberger.maennerProzent = (Number(result.rows[0].maennergaestegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.maischberger.name = "Sandra Maischberger";
    extraDataJSON.maischberger.schlagwort = countFunkton(extraDataJSON.maischberger.schlagwort, 1);
    callback();
  })
},
function(callback){
  client.query(queryIllner, function(err, result) {
    if(err) {return console.error('error query', err);}
    extraDataJSON.illner = result.rows[0];
    extraDataJSON.illner.frauenProzent = (Number(result.rows[0].frauengeastegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.illner.maennerProzent = (Number(result.rows[0].maennergaestegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.illner.name = "Mayrbrit Illner";
    extraDataJSON.illner.schlagwort = countFunkton(extraDataJSON.illner.schlagwort, 1);
    callback();
  })
},
function(callback){
  client.query(queryHart, function(err, result) {
    if(err) {return console.error('error query', err);}
    extraDataJSON.hart = result.rows[0];
    extraDataJSON.hart.frauenProzent = (Number(result.rows[0].frauengeastegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.hart.maennerProzent = (Number(result.rows[0].maennergaestegesamt) / Number(result.rows[0].allegaeste)) * 100;
    extraDataJSON.hart.name = "Hart Aber Fair";
    extraDataJSON.hart.schlagwort = countFunkton(extraDataJSON.hart.schlagwort, 1);
    callback();
  })
},
function(callback){

  getDataForCSV = "SELECT name, sendungthema, sendungart, to_char(s.sendungdatum,'yy-mm-dd') AS sendungdatum, sendunglink FROM shows as s INNER JOIN psrelation as psr ON s.id = psr.idshow INNER JOIN personen as p ON psr.idperson = p.id WHERE sendungdatum > '2013-11-30' AND p.edited = true AND s.edited = true";
  client.query(getDataForCSV, function(err, result) {
    if(err) {return console.error('error query', err);}
    dataForCSV = result.rows;
    callback();
  })
},
function(callback){
  getDataForShows= "SELECT sendungart, to_char(sendungdatum,'yy-mm-dd') AS sendungdatum, sendungthema, sendunglink, sendungkategorie, sendungschlagwort FROM shows WHERE sendungdatum > '2013-11-30' AND edited = true order by sendungdatum desc";
  client.query(getDataForShows, function(err, result) {
    if(err) {return console.error('error query', err);}
    finalJSON.shows.push(result.rows);
    callback();
  })
},
//Add Info about each Person and which shows they have been to
function(callback){

    var firstGetAllNames = "SELECT job, partei, name FROM Personen WHERE edited = true";
    client.query(firstGetAllNames, function(err, result) {

      var listOfPersonen = result.rows;
      //delete Parteien AND Sex
      // var extraInfoAboutALL = "WITH  SPD AS (SELECT count(partei) AS spd FROM personen WHERE partei='SPD'), CDU AS(SELECT count(partei) AS cdu FROM personen WHERE partei='CDU'), CSU AS(SELECT count(partei) AS csu FROM personen WHERE partei='CSU'), FDP AS(SELECT count(partei) AS fdp FROM personen WHERE partei='FDP'), Linke AS(SELECT count(partei) AS linke FROM personen WHERE partei='Die Linke'), Gruene AS(SELECT count(partei) AS gruene FROM personen WHERE partei='Grüne'), Piraten AS(SELECT count(partei) AS piraten FROM personen WHERE partei='Piraten'),  Frauen AS(SELECT count(sex) AS frauen FROM personen WHERE sex='w'), Maenner AS(SELECT count(sex) AS maenner FROM personen WHERE sex='m'),  firstEntry AS (SELECT to_char(sendungdatum,'dd.mm.yy') AS firstentry From shows order by sendungdatum limit 1), latestEntry AS (SELECT to_char(sendungdatum,'dd.mm.yy') AS lastentry From shows order by sendungdatum desc limit 1),  amountShows AS (SELECT count(id) AS countshows FROM shows), amountGaeste AS (SELECT count(id) AS countallgaeste FROM personen), amountIllner AS (SELECT count(id) AS countillner FROM shows WHERE sendungart='Illner' ), amountJauch AS (SELECT count(id) AS countjauch FROM shows WHERE sendungart='Jauch' ), amountHart AS (SELECT count(id) AS counthart FROM shows WHERE sendungart='Hart Aber Fair' ), amountWill AS (SELECT count(id) AS countwill FROM shows WHERE sendungart='Anne Will' )   SELECT * From SPD , CDU, CSU, FDP,Linke,Gruene,Piraten,Frauen,Maenner,firstEntry,latestEntry,amountShows,amountGaeste,amountIllner,amountJauch,amountHart,amountWill";
      //   client.query(extraInfoAboutALL, function(err, parteienResult) {

        // finalJSON.extraData.push(parteienResult.rows);
        var counter = 1;

        async.each(listOfPersonen, function(person) {

          var getAllShowsOfThatPerson = fmt("SELECT s.sendungthema, s.sendungart, s.sendungkategorie, to_char(s.sendungdatum,'dd.mm.yy') AS sendungdatum, s.sendunglink FROM shows as s INNER JOIN psrelation as psr ON s.id = psr.idshow INNER JOIN personen as p ON psr.idperson = p.id WHERE p.name ='%s' AND s.edited = true;", person.name);
          client.query(getAllShowsOfThatPerson, function(err, resultGetAllShows) {

             if(err) {return console.error('error 2 query JSON', err);};

             finalJSON.gaesteData.push({name: person.name, partei: person.partei, shows: resultGetAllShows.rows}) //job: person.job, 

            counter++;
             if (counter == listOfPersonen.length + 1){
                callback();
             }

          });

        })

      // })

    })
},
// Final Callback
function(callback){

   // console.log(finalJSON.will);
    //write Data as a JSON
      fs.writeFile('./data/personen.json', JSON.stringify(finalJSON, null, 4), function(err){
        console.log('File successfully written!');
      })

      fs.writeFile('./data/extraInfo.json', JSON.stringify(extraDataJSON, null, 4), function(err){
        console.log('File successfully written!');
      })

      json2csv({data: dataForCSV, fields: ['name', 'sendungart','sendungthema', 'sendungdatum',  'sendunglink']}, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile('./data/meinungsmaschineData.csv', csv, function(err) {
          if (err) throw err;
          console.log('file saved');
        });
      })

    //close connection to DB  
    client.end();
    callback();

}
]);


