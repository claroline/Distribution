/* global jsPlumb */

import angular from 'angular/index'
import AbstractQuestionDirective from './AbstractQuestionDirective'
import match from './../../Partials/Type/match.html'

/**
 * Match Question Directive
 * Manages Question of types Match
 *
 * @param {FeedbackService}      FeedbackService
 * @param {Function}             $timeout
 * @param {Object}               $window
 * @param {MatchQuestionService} MatchQuestionService
 * @returns {Object}
 * @constructor
 */
function MatchQuestionDirective(FeedbackService, $timeout, $window, MatchQuestionService) {
  return angular.merge({}, AbstractQuestionDirective.apply(this, arguments), {
    controller: 'MatchQuestionCtrl',
    controllerAs: 'matchQuestionCtrl',
    template: match,
    link: {
      post: function postLink(scope, element, attr, controller) {
        controller.container = element

        // init jsPlumb dom elements
        $timeout(function () {
          // MatchQuestion sub type is ToBind
          if (controller.question.toBind) {
            MatchQuestionService.initBindMatchQuestion(element)

            jsPlumb.bind('beforeDrop', function (info) {
              return controller.handleBeforeDrop(info)
            })

            /*jsPlumb.bind('beforeDetach', function(connection){
              // According to the doc Returning false - or nothing - from this callback will cause the detach to be abandoned, and the Connection will be reinstated or left on its current target.
              // But if we return false User will not be allowed to remove connection by clicking on it
              // If we return nothing this will be possible
            })*/

            jsPlumb.bind('beforeStartDetach', function(){
              return false
            })

            // remove one connection
            jsPlumb.bind('click', function (connection) {
              controller.removeConnection(connection)
            })

            controller.addPreviousConnections()
          } else {
            MatchQuestionService.initDragMatchQuestion(element)

            element.on('drop', '.droppable', function (event, ui) {
              controller.handleDragMatchQuestionDrop(event, ui)
            })

            controller.addPreviousDroppedItems()
          }

          // Manually show feedback (as we override the default postLink method)
          if (FeedbackService.isVisible()) {
            controller.onFeedbackShow()
          }
        }.bind(this))

        // Redraw connections if the browser is resized
        angular.element($window).on('resize', function () {
          jsPlumb.repaintEverything()
        })

        // On directive destroy, remove events
        scope.$on('$destroy', function handleDestroyEvent() {
          controller.reset()
          jsPlumb.detachEveryConnection()
          // use reset instead of deleteEveryEndpoint because reset also remove event listeners
          jsPlumb.reset()
        })
      }
    }
  })
}

// Extends AbstractQuestionDirective
MatchQuestionDirective.prototype = Object.create(AbstractQuestionDirective.prototype)

export default MatchQuestionDirective
