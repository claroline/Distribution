/**
 * Manages Primary Resources
 */
(function () {
    'use strict';

    angular.module('ResourcePrimaryModule').directive('resourcesPrimaryShow', [
        function ResourcesPrimaryEditDirective() {
            return {
                restrict: 'E',
                replace: true,
                controller: ResourcesPrimaryShowCtrl,
                controllerAs: 'resourcesPrimaryShowCtrl',
                template: '<iframe id="embeddedActivity" style="width: 100%; min-height: {{ resourcesPrimaryShowCtrl.height }}px;" data-ng-src="{{ resourcesPrimaryShowCtrl.resourceUrl.url }}" allowfullscreen></iframe>',
                scope: {
                    resources : '=', // Resources of the Step
                    height    : '='  // Min height for Resource display
                },
                bindToController: true,
                link: function (scope, element, attr) {
                    $(window).on('message',function(e) {
                        console.log('received');
                        console.log(e);

                        if (  (typeof e.originalEvent.data === 'string') && (e.originalEvent.data.indexOf('documentHeight:') > -1) ) {

                            // Split string from identifier
                            var height = e.originalEvent.data.split('documentHeight:')[1];

                            // do stuff with the height
                            $(element).css('height', parseInt(height) + 15);
                        }



                        // Check that message being passed is the documentHeight
                        /*if (typeof e.data === 'object' && e.data.documentHeight) {
                         }*/
                    });

                    /*var iframeChangeTimeout = null;
                     var resizeIframe = function (element) {
                     var newheight = element.contentDocument.body.scrollHeight;
                     element.height = (newheight) + "px";
                     console.log(newheight);
                     var height = $(element).find('body').first().height();
                     /!*console.log(height);
                     if (height) {
                     $(element).css('height', height + 15);
                     }*!/
                     };
                     // Manage the height of the iFrame
                     element.on('load', function () {
                     console.log('load iframe')
                     resizeIframe(element);
                     $(element.contentDocument.body).on('resize', function () {
                     resizeIframe(element)
                     });
                     });
                     $(window).on('resize', function () {
                     resizeIframe(element)
                     });*/



                    /*clearTimeout(iframeChangeTimeout);
                     iframeChangeTimeout = setTimeout(function () {
                     resizeIframe(element)
                     }, 300);*/
                }
            };
        }
    ]);
})();
