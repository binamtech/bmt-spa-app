'use strict';

function _guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}

var username = _guid();
var password = '111111';
var email = username + '@domain.com';

describe('User E2E Tests:', function() {
	describe('Authentication test', function() {
		it('Should be able to sign up', function() {

			browser.get('http://localhost:3000/#!/signup');

			element(by.model('user.firstName')).sendKeys(username);
			element(by.model('user.lastName')).sendKeys(username);
			element(by.model('user.username')).sendKeys(username);
			element(by.model('user.email')).sendKeys(email);
			element(by.model('user.password')).sendKeys(password);

			// Find the first (and only) button on the page and click it
			element(by.css('form[name="signupForm"] button[type="submit"]')).click();

			//redirect to login page after success signup
			expect(browser.getCurrentUrl()).toMatch(/\/#!\/login$/);
		});
		it('Should be able to login', function() {

			browser.get('http://localhost:3000/');

			element(by.model('user.username')).sendKeys(username);
			element(by.model('user.password')).sendKeys(password);

			// Find the first (and only) button on the page and click it
			element(by.css('form[name="authForm"] button[type="submit"]')).click();

/*			element(by.binding('authenticationError')).getText().then(function(errorText)
			{
				expect(errorText).toBeUndefined();// toBe('User is not logged in');
			});*/

			expect(browser.getCurrentUrl()).toMatch(/\/#!\/$/);
			browser.executeScript("return window.localStorage.getItem('user');").then(function(retValue) {
				console.log(retValue);
				expect(retValue).not.toBeNull();
			});
		});
	});
});