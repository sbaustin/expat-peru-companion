/*
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var app = angular.module('ep', []);
app.value('pluginData', window.pluginData);

app.directive('colorpicker', function() {
    return {
        restrict: 'AEC',
       // require: 'ngModel',
    // scope: {ngModel: '=' },
        
        link: function (scope, element, attrs) {
            var inited = false;
           scope.$watch('colors', function(newVal){
                if (newVal!==undefined && !inited) {
                    inited = true;
                     $(element).spectrum({ color: scope.colors[attrs.colorpicker],
                        change: function (color) {
                    //scope.postTitleColor = ; // #ff0000
                        scope.$apply(function () {
                        
                        scope.colors[attrs.colorpicker] = color.toHexString();
                    });
                }

            });
                }  else if (inited){
                    $(element).spectrum('set', scope.colors[attrs.colorpicker]);
                }
           }, true);
           


        }
    }
    }
);

        app.controller('MainCtrl', function($scope, pluginData) {

            chrome.storage.sync.get(pluginData, function(items) {
                $scope.normalizertext = items.normalizertext;
                $scope.imageFix = items.imagefix;
                $scope.colors = items.colors;
                $scope.fullWidth = items.fullWidth;
                $scope.$apply();
            });

            $scope.imageFix = true;
 
            $scope.setTo = function(t) {
                $scope.normalizertext = t;
                angular.forEach($scope.normalizer, function(item) {
                    item = false;
                });
                $scope[t] = true;
                //localStorage.add('normalizertext', 'normalized');
            }

            //var def = localStorage.getItem('normalizertext');

            $scope.$watch('colors', function(newVal){
                 chrome.storage.sync.set({ 'colors': $scope.colors}, function () {

                  });
            }, true);

            $scope.setImageFix = function () {
                $scope.imageFix = !$scope.imageFix;
                chrome.storage.sync.set({ 'imagefix': $scope.imageFix}, function () {

                });
            }

            $scope.setWidth = function(){
                $scope.fullWidth = !$scope.fullWidth;
            }

            $scope.setTransparent = function(o) {
                $scope.colors[o] = 'transparent';
            }

            $scope.$watch('normalizertext', function(newVal) {
                chrome.storage.sync.set({'normalizertext': newVal}, function() {
   
   
                });
                //localStorage.setItem('normalizertext', newVal);
            });

             $scope.$watch('fullWidth', function(newVal) {
                chrome.storage.sync.set({'fullWidth': newVal}, function() {
   
   
                });
                //localStorage.setItem('normalizertext', newVal);
            });
 
        });

