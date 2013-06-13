  
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

/*var app = angular.module('popup', []);


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

        app.controller('MainCtrl', function($scope) {

            chrome.storage.sync.get('topics', function(items) {
                $scope.links = JSON.parse(items.topics);
                $scope.$apply();
            });

            $scope.openUrl = function(link) {
 				chrome.tabs.create({url: link.href});
            	
            	
            }

        
 
        });



  */
$(document).ready(function() {
     
        $('a.external').on('click', 'body', function(e) {
            e.preventDefault();
                chrome.tabs.getSelected(null,function(tab) {
                        chrome.tabs.update(tab.id, {url:  $(this).attr('href')});
                      });
                      window.close(); // To close the popup.
        });
         chrome.storage.sync.get('topics', function(items) {
                var $list = $('<ul>');
                var links = JSON.parse(items.topics);

                $.each(links, function(i){
                    $li = $("<li><a class='external' href='" + this.href + "'>" + this.title + "</a></li>");
                    $('a', $li).click(function(e){
                        e.preventDefault();
                        var $that = $(this);
                        chrome.tabs.getSelected(null,function(tab) {
                          chrome.tabs.update(tab.id, {url:  $that.attr('href')});
                           window.close();
                        });

                        
                    });
                    /*$li.on('click', function(e){
                     chrome.tabs.getSelected(null,function(tab) {
                        chrome.tabs.update(tab.id, {url:  $('a', this).attr('href')});
                      });
                      window.close(); // To close the popup.
                    });*/
                    $list.append($li);
                });
                //$('#content').empty();
                $('#content').append($list);
            });
});
   
