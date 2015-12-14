'use strict';

angular.module('users').controller('UsersCtrl', ['$scope', '$state', 'AuthenticationFactory',
	'UserAuthFactory', 'Users', 'userNotifyMessages', '$uibModal',
	function ($scope, $state, AuthenticationFactory, UserAuthFactory, Users, userNotifyMessages, $uibModal) {

		/*private:*/
		function _clearMessages(){
			$scope.alertError = null;
			$scope.alertInfo = null;
		}

		function _showError(errorResponse) {
			var data = errorResponse.data || {};
			$scope.alertError = data.message || userNotifyMessages.serverError;
			$scope.alertInfo = null;
			console.error(errorResponse);
		}

		function _openModal(config){
			var modalConfig = config || {};
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'shared/modal/templates/confirm.modal.template.html',
				controller: 'ConfirmModalCtrl',
				/*size: size,*/
				resolve: {
					modalConfig: modalConfig
				}
			});
			return modalInstance;
		}

		function _deleteAccount(user){
			if (!user) {
				return;
			}
			var modalInstance = _openModal({
				messageTranslate: 'MSG_ACCOUNT_DELETE_CONFIRM',
				params: {username: user.username},
				type: 'danger'
			});
			modalInstance.result.then(function () {
				user.$remove(function() {
					UserAuthFactory.logout();
				}, _showError);
			});
		}

		function _deleteUser(user){
			if (!user) {
				return;
			}
			var modalInstance = _openModal({
				messageTranslate: 'MSG_USER_DELETE_CONFIRM',
				params: {username: user.username},
				type: 'danger'
			});
			modalInstance.result.then(function () {
				user.$remove(function() {
					var index = $scope.userList.indexOf(user);
					if (index !== -1) {
						$scope.userList.splice(index, 1);
					}
				}, _showError);
			});
		}

		/*public:*/

		$scope.authentication = AuthenticationFactory;

		$scope.logout = function () {
			UserAuthFactory.logout();
		};

		$scope.signup = function () {
			_clearMessages();
			var user = {
				firstName: $scope.user.firstName,
				lastName: $scope.user.lastName,
				email: $scope.user.email,
				username: $scope.user.username,
				password: $scope.user.password
			};
			UserAuthFactory.signup(user).then(
					function () {
						if (!AuthenticationFactory.isLogged) {
							$state.go("login");
						} else {
							$state.go('home');
						}
					}, function (err) {
						var data = err || {};
						$scope.alertError = data.message || userNotifyMessages.serverError;
					});
		};

		$scope.create = function() {
			_clearMessages();
			var user = new Users({
				firstName: $scope.user.firstName,
				lastName: $scope.user.lastName,
				email: $scope.user.email,
				username: $scope.user.username,
				password: $scope.user.password
			});
			user.$save(function() {
				if (!AuthenticationFactory.isLogged) {
					$state.go("login");
				} else {
					$state.go('home');
				}
			}, function(errorResponse) {
				var data = errorResponse.data || {};
				$scope.alertError = data.message || userNotifyMessages.serverError;
				console.error(errorResponse);
			});
		};

		$scope.findOne = function () {
			_clearMessages();
			$scope.user = Users.get({
						id: AuthenticationFactory.user.id
					}, function (){}, _showError);
			//$scope.user.$promise.catch(_showError);
		};

		$scope.find = function () {
			_clearMessages();
			$scope.userList = Users.query(function (){}, _showError);
		};

		$scope.update = function() {
			_clearMessages();
			var user = new Users({
				id: AuthenticationFactory.user.id,
				firstName: $scope.user.firstName,
				lastName: $scope.user.lastName,
				email: $scope.user.email,
				username: $scope.user.username,
				role: $scope.user.role
			});
			user.$update(function(response) {
				$scope.alertInfo = response.message || userNotifyMessages.profileSuccess;
				$scope.alertError = null;
				$scope.usernameEdit = false;
				$scope.emailEdit = false;
			}, _showError);
		};

		$scope.delete = function(user) {
			_clearMessages();
			if (user) {
				if (user.id === AuthenticationFactory.user.id) {
					$scope.alertError = 'MSG_USER_DELETE_ERROR';
				} else {
					_deleteUser(user);
				}
			} else {
				//remove account
				if (AuthenticationFactory.isLogged && $scope.user) {
					_deleteAccount($scope.user);
				}
			}
		};

		$scope.changePassword = function(password1, password2) {
			_clearMessages();
			if (password1 !== undefined && password1 === password2) {
				var user = new Users({
					id: AuthenticationFactory.user.id,
					password: password1
				});
				user.$update(function() {
					UserAuthFactory.logout();
				}, _showError);
			} else {
				$scope.alertError = userNotifyMessages.invalidCredentials;
				$scope.alertInfo = null;
			}
		};

		/*generate module side menu*/

		function _getStateMenuItem(stateName) {
			return $state.href('settings.menu',{menuItem: stateName});
		}

		var accountMenuGroup = {
			title: "LABEL_USER_ACCOUNT",
			state: "#",
			//disableCollapse: true,
			//isCollapsed: true,
			items: [
				{
					title: "VIEW_HEADER_PROFILE",
					state: _getStateMenuItem("profile"),
					//state: "#/settings/profile",
					iconClass: "fa fa-fw fa-user",
				},
				{
					title: "VIEW_HEADER_CHANGE_PASSWORD",
					state: _getStateMenuItem("password"),
					iconClass: "fa fa-fw fa-key",
				},
				{
					title: "LABEL_USER_DELETE_ACCOUNT",
					state: "#",
					action: $scope.delete,
					iconClass: "fa fa-fw fa-remove",
				},
				{
					title: "VIEW_HEADER_LOGOUT",
					state: "#",
					action: $scope.logout
				}
			]
		};

		var usersMenuGroup = {
			title: "VIEW_HEADER_USERS",
			state: "#",
			//disableCollapse: true,
			//isCollapsed: true,
			items: [
				{
					title: "VIEW_HEADER_USERS",
					state: _getStateMenuItem("users"),
					iconClass: "fa fa-fw fa-user",
				}
			]
		};

		var settingsMenu = [];
		settingsMenu.push(accountMenuGroup);

		//getting role from parent $rootScope
		if ($scope.role === 'Admin') {
			settingsMenu.push(usersMenuGroup);
		}

		$scope.menu = settingsMenu;

		$scope.menuClick = function(menuItem) {
			//console.log(menuItem);
			if (menuItem && menuItem.action && typeof menuItem.action === 'function') {
				menuItem.action.apply($scope);
			}
		};
	}
]);
