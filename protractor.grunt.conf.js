exports.config = {
	specs: ['src/*[!lib]*/tests/e2e/*.js'],
	capabilities: {
		'browserName': 'chrome'
	}
};