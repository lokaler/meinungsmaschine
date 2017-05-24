## Requirements
- [Node.js](http://nodejs.org/)
- [npm](https://github.com/npm/npm)
- Postgres
- Postgres "Online Editor"

## Set Up

1. Set Up Postgres
	- create DB e.g."meinungsmaschiene2017"
	- Create tables with SQL command (below)

2. set up and run data importer
	- go to: backend/importer
	- run: npm install pg underscore.string underscore async fs json2csv
	- Open importer file "addToDBWeb.js". 
		-change "conString" variable to match passwort,user,db-name
	- run db importer: node addToDBWeb.js
	(error will appear as long as data is not editied maually in db; however data will be added to DB)
	- check if data is in DB

3. Set up and run scraper
  - go to: backend/scraper/
  - install: npm install
  - run scraper: node index.js


4. Edit Data in DB
	- edit data with "Online Editor" --> Lorenz

5. Check Data after edited
	- run DB Importer again
	- check if 3 files are written to /backend/importer/data

6. Deploy frontend

7. Write Script to move all 3 files from backend every full hour from:
	backend: /backend/importer/data --> forntend meinungsmaschine-frontend/data

8. Set up Cron Job
	Run scraper once a day around 8:30
	Run importer 5min after every full hour 

DONE ;)



## QUERRY

CREATE TABLE personen
(
  id serial NOT NULL,
  name character varying(255),
  job character varying(255),
  partei character varying(255),
  sex character varying(2),
  alter date,
  edited boolean,
  CONSTRAINT personen_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE personen
  OWNER TO postgres;


CREATE TABLE psrelation
(
  idperson numeric(5,0),
  idshow numeric(5,0)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE psrelation
  OWNER TO postgres;


CREATE TABLE shows
(
  id serial NOT NULL,
  sendungthema character varying(255),
  sendungart character varying(255),
  sendungdatum date,
  sendunglink character varying(500),
  sendungkategorie character varying(255),
  sendungschlagwort character varying(255),
  edited boolean,
  CONSTRAINT shows_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE shows
  OWNER TO postgres;