/* disable link attr directive */

import angular from 'angular/index'

angular
  .module('LinkDisabled', [])
  .directive('aDisabled', function() {
    return {
      compile: function(tElement, tAttrs) {
        //Disable ngClick
        tAttrs['ngClick'] = '!('+tAttrs['aDisabled']+') && ('+tAttrs['ngClick']+')'

        //return a link function
        return function (scope, iElement, iAttrs) {

          //Toggle "disabled" to class when aDisabled becomes true
          scope.$watch(iAttrs['aDisabled'], function(newValue) {
            if (newValue !== undefined) {
              iElement.toggleClass('disabled', newValue)
            }
          })

          //Disable href on click
          iElement.on('click', function(e) {
            if (scope.$eval(iAttrs['aDisabled'])) {
              e.preventDefault()
            }
          })
        }
      }
    }
  })
