var path = require('path'),
	fs = require('fs-extra');

module.exports = function(db, callback) {
	var datastore = path.resolve(__dirname, '..', db + '.json');

	fs.exists(datastore, function(exists) {
		if (exists) {
			fs.rename(datastore, datastore + '.old', function(err) {
				if (!err) callback();
				else {
					console.log('Error initializing the DB: ', err);
					process.exit(1);
				}
			});
		} else {
			fs.ensureDir(path.dirname(datastore), function(err) {
				if (!err) callback();
			});
		}
	});
};
