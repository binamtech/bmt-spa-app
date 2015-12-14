/*jshint bitwise: false*/

'use strict';

module.exports.DocPermission = {
	READ: 1,
	WRITE: 1 << 1,
	MODIFY:1 << 2
};

module.exports.RestApiPath = '/api/v1';