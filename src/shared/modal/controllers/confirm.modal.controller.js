'use strict';

angular.module('main').controller('ConfirmModalCtrl',["$scope", "$uibModalInstance", "modalConfig",
	function ($scope, $uibModalInstance, modalConfig) {

		$scope.caption = modalConfig.caption || 'DIALOG_HEADER_CONFIRM';
		$scope.type = modalConfig.type || 'info';

		$scope.message = modalConfig.message;
		$scope.messageTranslate = modalConfig.messageTranslate;
		$scope.params = modalConfig.params;

		$scope.ok = function () {
			$uibModalInstance.close('ok');
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}]);