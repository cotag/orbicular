/**
 *    CoTag Orbicular
 *    A more or less pure CSS, circular, progress bar
 *
 *   Copyright (c) 2014 CoTag Media.
 *
 *    @author     Stephen von Takach <steve@cotag.me>
 *    @copyright  2014 cotag.me
 *
 *
 *     References:
 *        * http://fromanegg.com/post/41302147556/100-pure-css-radial-progress-bar
 *        * https://medium.com/@andsens/radial-progress-indicator-using-css-a917b80c43f9
 *
 **/


(function () {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('Orbicular', ['angular'], angularOrbicular);
  } else {
    angularOrbicular(angular);
  }

  function angularOrbicular(angular) {
    return angular.module('Orbicular', []).

      // isolated circular progress bar
      directive('orbicular', ['$window', function (windowRef) {

        // Constants here reduce memory requirements of each circle
        var $window = angular.element(windowRef),

          // Cache event strings
          resizeEvents = 'orientationchange resize',

          // Set the rotation of the square
          updateProgress = function (circles, pos, direction) {
            // If total is 0 or negative it can lead to Infinity or NaN values
            if (!isFinite(pos)) {
              pos = 0;
            }

            /**
             * circles are:
             * 0: .co-full
             * 1: .co-full > .co-fill
             * 2: .co-half
             * 3: .co-half > .co-fill
             * 4: .co-half > .co-fix
             **/
            if ( direction !== undefined && direction == 'counterclockwise' )
              var modifiers = [-2,1,-1,1,2];
            else // direction is clockwise by default
              var modifiers = [1,1,0,1,2];

            var modifiedPos, circle;
            for (var i=0;i<circles.length; i++) {
              if (modifiers[i]==0) continue;
              modifiedPos = pos * modifiers[i];
              circle = angular.element(circles[i]);
              circle.css({
                '-webkit-transform': 'translate3d(0, 0, 0) rotate(' + modifiedPos + 'deg)',
                '-moz-transform': 'translate3d(0, 0, 0) rotate(' + modifiedPos + 'deg)',
                '-ms-transform': 'translate3d(0, 0, 0) rotate(' + modifiedPos + 'deg)',
                '-o-transform': 'translate3d(0, 0, 0) rotate(' + modifiedPos + 'deg)',
                'transform': 'translate3d(0, 0, 0) rotate(' + modifiedPos + 'deg)'
              });
            }
          };

        return {
          template:
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
                '<div>' +
                  '<div>' +
                    '<div ng-transclude></div>' +
                  '</div>' +
                '</div>' +
              '</div>',
          transclude: true,
          restrict: 'EA',
          scope: {
            current: '=progression',
            total: '='
          },
          link: function (scope, element, attrs) {
            var circles = [],
              // Width must be an even number of pixels for the effect to work.
              setWidth = function () {
                var width = element.prop('offsetWidth');
                element.css('font-size', width - (width % 2) + 'px');
              },

              update = function () {
                updateProgress(circles,
                  Math.min(1, scope.current / scope.total) * 180.0, 
                  attrs.direction
                );
              };


            // circles = element.find('div.co-full, div.co-fill')
            circles.push(element.children()[0]);
            circles.push(
              angular.element(
                element.children()[0]
              ).children()[0]
            );
            circles.push(element.children()[1]);
            circles.push(
              angular.element(
                element.children()[1]
              ).children()[0]
            );
            // fix = element.find('div.co-fix')
            circles.push(
              angular.element(
                element.children()[1]
              ).children()[1]
            );

            //circles = angular.element(circles);

            // we have to use em's for the clip function to work like a percentage
            // so we have to manually perform the resize based on width
            setWidth();
            scope.$on('orb width', setWidth); // for programmatic resizing

            // Optionally resize
            if (attrs.hasOwnProperty('resize')) {
              scope.$on('$destroy', function () {
                $window.off(resizeEvents, setWidth);
              });
              $window.on(resizeEvents, setWidth);
            }

            // we watch for changes to the progress indicator of the parent scope
            scope.$watch('current', update);
            scope.$watch('total', update);
          }
        };
      }]);
  }
}());
