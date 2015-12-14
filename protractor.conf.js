exports.config = {
	specs: ['src/*[!lib]*/tests/e2e/*.js'],
	seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
	capabilities: {
		'browserName': 'chrome'
	}
};