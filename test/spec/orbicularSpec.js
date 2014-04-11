'use strict';


describe('Orbicular:orbicular (directive)', function() {
    var element,
        bar,
        degrees,
        extract = /rotate\(([\d|.]+)deg\)/i,
        findDegrees = function(el) {
            return parseFloat(el.attr('style').match(extract)[1], 10);
        };

    beforeEach(function() {
        module('Orbicular');

        inject(function($rootScope, $compile) {
            $rootScope.progression = 0;
            $rootScope.total = 360;

            element = $compile('<orbicular progression="progression" total="total"></orbicular>')($rootScope);
            $rootScope.$digest();

            bar = angular.element(
                angular.element(
                    element.children()[1]
                ).children()[0]
            );
        });
    });

    afterEach(function() {
        element.remove();
        degrees = undefined;
    });

    it('should link to variables on the parent scope', inject(function($rootScope) {
        // confirm initial state
        expect($rootScope.progression).toBe(0);
        expect($rootScope.total).toBe(360);
        degrees = findDegrees(bar);
        expect(degrees).toBe(0);


        // Update the progress
        $rootScope.progression = 10;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(10);
        expect($rootScope.total).toBe(360);
        degrees = findDegrees(bar);
        expect(degrees).toBe(10);


        // update the total
        $rootScope.total = 300;
        $rootScope.progression = 11; // progression triggers changes (not total)
        $rootScope.$digest();

        expect($rootScope.progression).toBe(11);
        expect($rootScope.total).toBe(300);
        degrees = findDegrees(bar);
        expect(degrees).toBeGreaterThan(11);    // indicating that the total has changed
    }));

    it('should smoothly animate the transition forward from one side to the other', inject(function($rootScope) {
        // move progress bar past half way
        $rootScope.progression = 200;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(200);
        degrees = findDegrees(bar);
        expect(degrees).toBe(180);      // stops here to transition the graphic


        // the animation end event should move the progression forward
        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(200);
        degrees = findDegrees(bar);
        expect(degrees).toBe(200);
    }));

    it('should transition when stopping at 50% going forward', inject(function($rootScope) {
        // move progression bar to half way
        $rootScope.progression = 180;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(180);
        degrees = findDegrees(bar);
        expect(degrees).toBe(180);      // stops here to transition the graphic

        // the animation end event should move the progression forward
        bar.trigger('transitionend');
        $rootScope.$digest();

        // move progress bar past half way
        $rootScope.progression = 200;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(200);
        degrees = findDegrees(bar);
        expect(degrees).toBe(200);      // stops here to transition the graphic

        // the animation end event should move the progress forward
        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(200);
        degrees = findDegrees(bar);
        expect(degrees).toBe(200);
    }));

    it('should transition when stopping at 50% going backwards', inject(function($rootScope) {
        // move progress bar past half way
        $rootScope.progression = 200;
        $rootScope.$digest();

        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(200);
        degrees = findDegrees(bar);
        expect(degrees).toBe(200);


        // Move back to 50%
        $rootScope.progression = 180;
        $rootScope.$digest();

        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(180);
        degrees = findDegrees(bar);
        expect(degrees).toBe(180);

        // Move backwards
        $rootScope.progression = 50;
        $rootScope.$digest();

        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(50);
        degrees = findDegrees(bar);
        expect(degrees).toBe(50);
    }));

    it('should smoothly animate the transition backwards from one side to the other', inject(function($rootScope) {
        // move progress bar past half way
        $rootScope.progression = 200;
        $rootScope.$digest();
        bar.trigger('transitionend');
        $rootScope.$digest();


        // move the bar back
        $rootScope.progression = 100;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(100);
        degrees = findDegrees(bar);
        expect(degrees).toBeGreaterThan(180);      // stops very close to 180
        expect(degrees).toBeLessThan(181);


        // the animation end event should complete the process
        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(100);
        degrees = findDegrees(bar);
        expect(degrees).toBe(100);
    }));

    it('should handle further updates (in the same direction) during a transition phase', inject(function($rootScope) {
        // move progress bar past half way
        $rootScope.progression = 200;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(200);
        degrees = findDegrees(bar);
        expect(degrees).toBe(180);      // stops here to transition the graphic


        // update again before the transition end event
        $rootScope.progression = 300;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(300);
        degrees = findDegrees(bar);
        expect(degrees).toBe(180);


        // the animation end event should move the progress forward
        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(300);
        degrees = findDegrees(bar);
        expect(degrees).toBe(300);


        // should work backwards too
        $rootScope.progression = 100;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(100);
        degrees = findDegrees(bar);
        expect(degrees).toBeGreaterThan(180);      // stops very close to 180
        expect(degrees).toBeLessThan(181);

        // update again before the transition end event
        $rootScope.progression = 0;
        $rootScope.$digest();

        expect($rootScope.progression).toBe(0);
        degrees = findDegrees(bar);
        expect(degrees).toBeGreaterThan(180);      // stops very close to 180
        expect(degrees).toBeLessThan(181);

        // the animation end event should complete the process
        bar.trigger('transitionend');
        $rootScope.$digest();

        expect($rootScope.progression).toBe(0);
        degrees = findDegrees(bar);
        expect(degrees).toBe(0);
    }));
});

