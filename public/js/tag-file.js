var app = angular.module('myApp',['ngFileUpload']);

app.controller('myCtrl', function($scope, $http, Upload){

	$scope.init = function() {
		$scope.tags = ["val0", "val1", "val2"];
		$scope.rawData = [];
		$scope.files = [];

		$scope.visInput = true;
		$scope.visTag = false;

		$scope.tagCtr = -1;
		$scope.loadImageText = "Next";
	}

	$scope.init();

	$scope.getBoolArray = function(length, bool) {
		var arr = [];
		for(var i=0; i<length; ++i) {
			arr.push(bool);
		}
		return arr;
	}

	$scope.initRawData = function() {
		$scope.rawData = [];
		for(var i=0; i<$scope.files.length; ++i) {
			$scope.rawData.push({ "filename" : $scope.files[i].name, "tags" : $scope.getBoolArray($scope.tags.length, false)});
		}
	}

	$scope.loadImage = function() {
		if($scope.tagCtr == $scope.files.length - 2) {
			$scope.loadImageText = "Finish";
		}
		if($scope.tagCtr == $scope.files.length - 1) {
			var data = [];

			for(var i=0; i<$scope.rawData.length; ++i) {
				var ele = $scope.rawData[i];
				var obj = {};
				obj.filename = ele.filename;
				obj.tags = [];

				ele.tags.forEach(function(_ele, idx, arr) {
					if(_ele) {
						obj.tags.push($scope.tags[idx]);
					}
				});
				data.push(obj);
			}
			console.log(data);

			var req = {
				method : 'POST',
				url : '/tag',
				data : {
					"data": data
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			};

			$http(req).
			then(function(response){
				console.log(response);
				if(response.data.result == true) {
					document.getElementById('file-input').value= null;
					$scope.init();
				}
			}, function(err){
				console.log(err);
			});
		}
		else {
			var reader = new FileReader();
			reader.onload = function(){
				var output = document.getElementById('output');
				output.src = reader.result;
			};
			$scope.tagCtr++;
			reader.readAsDataURL($scope.files[$scope.tagCtr]);
		}
	};

	$scope.filesChosen = function(files) {
		$scope.files = files;
		// console.log(files);
	}

	$scope.startTag = function() {
		$scope.visInput = false;
		$scope.visTag = true;

		$scope.initRawData();
		$scope.loadImage();
	}
});
