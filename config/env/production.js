// Production configuration options

module.exports = {
	db: 'mongodb://localhost/spa-app',
	sessionSecret: 'productionSessionSecret',
	viewEngine: 'ejs',
	jwtSecret: 'productiontSecret',
	port: 3000
};