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
        directive('orbicular', ['$window', function ($window) {
            return {
                template: '<div class="co-circle-progress">' +
                            '<div class="co-circle bg"></div>' +
                            '<div class="co-progress" ng-class="{gt50: nextHalf}">' +
                                '<div class="co-circle"></div>' +
                                '<div class="co-circle filled"></div>' +
                            '</div>' +
                            '<div class="circle-content">' +
                                '<div><div ng-transclude></div></div>' +
                            '</div>' +
                        '</div>',
                transclude: true,
                replace: true,
                restrict: 'EA',
                scope: {
                    current: '=progress',
                    total: '='
                },
                link: function (scope, element) {
                    var applyProgress = true,    // used to coordinate the transition animation
                        progressTemp,            // holds the progress during the coordinated transition
                        //progressEl = element.find('div.co-progress > div:first-child'),
                        progressEl = angular.element(
                            angular.element(
                                element.children()[1]
                            ).children()[0]
                        ),

                        // Width must be an even number of pixels for the effect to work.
                        setWidth = function () {
                            var width = element.prop('offsetWidth');
                            element.css('font-size', width - (width % 2) + 'px');
                        },

                        // Set the rotation of the square
                        updateProgress = function (pos) {
                            progressEl.css({
                                '-moz-transform': 'rotate(' + pos + 'deg)',
                                '-ms-transform': 'rotate(' + pos + 'deg)',
                                '-webkit-transform': 'rotate(' + pos + 'deg)',
                                '-o-transform': 'rotate(' + pos + 'deg)',
                                'transform': 'rotate(' + pos + 'deg)'
                            });
                        },

                        // Cache the transition events string
                        transitionEvents = 'webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd transitionend',

                        // Cache the forward transition (clockwise)
                        moveForward = function () {
                            progressEl.unbind(transitionEvents);
                            scope.nextHalf = true;
                            scope.$apply();
                            updateProgress(progressTemp);
                        },

                        // Cache the backwards transition (anti-clockwise)
                        moveBackwards = function () {
                            progressEl.unbind(transitionEvents);
                            scope.nextHalf = false;
                            scope.$apply();
                            updateProgress(progressTemp);
                        };

                    // Indicates which side the filled half circle should be located
                    scope.nextHalf = false;

                    // we have to use em's for the clip function to work like a percentage
                    // so we have to manually perform the resize based on width
                    setWidth();
                    angular.element($window).bind('orientationchange resize', setWidth);
                    scope.$on('$destroy', function () {
                        angular.element($window).unbind('orientationchange', setWidth);
                        angular.element($window).unbind('resize', setWidth);
                    });

                    // we watch for changes to the progress indicator of the parent scope
                    scope.$watch('current', function (newValue) {
                        newValue = newValue / scope.total * 360;

                        if (newValue > 180 && !scope.nextHalf) {
                            progressTemp = newValue;
                            if (applyProgress) {
                                applyProgress = false;
                                updateProgress(180);
                                progressEl.bind(transitionEvents, moveForward);
                            }
                        } else if (newValue <= 180 && scope.nextHalf) {
                            progressTemp = newValue;
                            if (!applyProgress) {
                                applyProgress = true;
                                updateProgress(180.000001);
                                progressEl.bind(transitionEvents, moveBackwards);
                            }
                        } else {
                            updateProgress(newValue);
                        }
                    });
                }
            };
        }]);

}(this.angular));
