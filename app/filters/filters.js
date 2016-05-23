(function() {
	'use strict';
	angular.module('mcrutt')
		.filter('currentyear', filterCurrentYear);

	filterCurrentYear.$inject = ['$filter'];

	function filterCurrentYear ($filter) {
		return function() {
			return $filter('date')(new Date(), 'yyyy');
		};
	};
})();