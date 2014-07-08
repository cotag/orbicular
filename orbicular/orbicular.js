/**
*    CoTag Orbicular
*    A more or less pure CSS, circular, progress bar
*    
*   Copyright (c) 2013 CoTag Media.
*    
*    @author     Stephen von Takach <steve@cotag.me>
*    @copyright  2013 cotag.me
* 
*     
*     References:
*        * http://fromanegg.com/post/41302147556/100-pure-css-radial-progress-bar
*
**/


(function (angular) {
    'use strict';

    angular.module('Orbicular', []).

        // isolated circular progress bar
        directive('orbicular', ['$window', function (windowRef) {

            // Constants here reduce memory requirements of each circle
            var $window = angular.element(windowRef),

                // Cache event strings
                transitionEvents = 'webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd transitionend',
                resizeEvents = 'orientationchange resize',

                // Set the rotation of the square
                updateProgress = function (group1, group2, pos) {
                    group1.css({
                        '-webkit-transform': 'rotate(' + pos + 'deg)',
                        '-moz-transform': 'rotate(' + pos + 'deg)',
                        '-ms-transform': 'rotate(' + pos + 'deg)',
                        '-o-transform': 'rotate(' + pos + 'deg)',
                        'transform': 'rotate(' + pos + 'deg)'
                    });
                    pos = pos * 2;
                    group2.css({
                        '-webkit-transform': 'rotate(' + pos + 'deg)',
                        '-moz-transform': 'rotate(' + pos + 'deg)',
                        '-ms-transform': 'rotate(' + pos + 'deg)',
                        '-o-transform': 'rotate(' + pos + 'deg)',
                        'transform': 'rotate(' + pos + 'deg)'
                    });
                };

            return {
                template: '<div class="co-circle-progress">' +
                            '<div class="co-circle co-full">' +
                                '<div class="co-fill"></div>' +
                            '</div>' +
                            '<div class="co-circle co-half">' +
                                '<div class="co-fill"></div>' +
                                '<div class="co-fill co-fix"></div>' +
                            '</div>' +
                            // optional shadow
                            '<div class="co-shadow"></div>' +
                            '<div class="co-content">' +
                                '<div><div ng-transclude></div></div>' +
                            '</div>' +
                        '</div>',
                transclude: true,
                replace: true,
                restrict: 'EA',
                scope: {
                    current: '=progression',
                    total: '='
                },
                link: function (scope, element, attrs) {
                    var group1 = [],
                        group2 = [],

                        // Width must be an even number of pixels for the effect to work.
                        setWidth = function () {
                            var width = element.prop('offsetWidth');
                            element.css('font-size', width - (width % 2) + 'px');
                        };


                    //progressEl = element.find('div.co-progress > div:first-child')
                    group1.push(element.children()[0]);
                    group1.push(
                        angular.element(
                            element.children()[0]
                        ).children()[0]
                    );
                    group1.push(
                        angular.element(
                            element.children()[1]
                        ).children()[0]
                    );
                    group1 = angular.element(group1);

                    group2.push(
                        angular.element(
                            element.children()[1]
                        ).children()[1]
                    );
                    group2 = angular.element(group2);


                    // we have to use em's for the clip function to work like a percentage
                    // so we have to manually perform the resize based on width
                    setWidth();
                    scope.$on('orb width', setWidth); // for programmatic resizing

                    // Optionally resize
                    if (attrs.resize) {
                        scope.$on('$destroy', function () {
                            $window.off(resizeEvents, setWidth);
                        });
                        $window.on(resizeEvents, setWidth);
                    }

                    // we watch for changes to the progress indicator of the parent scope
                    scope.$watch('current', function (newValue) {
                        newValue = newValue / scope.total * 360 / 2;
                        updateProgress(group1, group2, newValue);
                    });
                }
            };
        }]);

}(this.angular));
