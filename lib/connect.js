'use strict';

const r = require('rethinkdb');
const config = require('../config/database');

module.exports.connect = (req, res, next) => {
	let count = 0;

	(function _connect() {
		r.connect( config, (error, connection) => {
			if (error && error.name === 'ReqDriverError' && error.message.indexOf('Could not connect') === 0 && ++count < 31) {
				console.log(error);
				setTimeout(_connect, 1000);
				return;
			}
			req._rdb = connection;
			next();
		})
	})();
};

module.exports.close = (req, res, next) => {
	req._rdb.close();
}