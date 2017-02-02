/**
 * Step show controller
 */

import angular from 'angular/index'
import Pjax from 'pjax'
//import '@sergiovilar/jquery-pjax/jquery.pjax'
import StepBaseCtrl from './StepBaseCtrl'

export default class StepShowCtrl extends StepBaseCtrl {
  constructor(step, inheritedResources, PathService, authorization, $sce, UserProgressionService, url) {
    super(step, inheritedResources, PathService)

    this.userProgressionService = UserProgressionService
    this.UrlGenerator = url

    if (angular.isDefined(this.step) && angular.isDefined(this.step.description) && typeof this.step.description === 'string') {
      // Trust content to allow Cross Sites URL
      this.step.description = $sce.trustAsHtml(this.step.description)
    }

    this.authorization = authorization

    /**
     * Progression of the User for the current Step (NOT the progression for the whole Path)
     * @type {object}
     */
    this.progression = this.userProgressionService.getForStep(this.step)

    if (this.authorization && this.authorization.granted) {
      if (angular.isObject(this.step.primaryResource)
          && angular.isObject(this.step.primaryResource[0])) {

        /*$(document).ready(() => {
          $(document).pjax('a', '.resource-container')
          $.pjax({
            url: this.UrlGenerator('claro_resource_open', {
              node: this.step.primaryResource[0].id,
              resourceType: this.step.primaryResource[0].type
            }),
            container: '.resource-container'
          })
        })*/
        new Pjax({
          debug: true,
          scrollTo: false,
          selectors: [
            "title",
            ".stylesheets",
            ".resource-container",
            ".javascript-footer",
          ],
          /*switches: {
            '.javascript-footer': (newEl, oldEl, options) => {
              console.log('this is sparta !!!!')
              oldEl.outerHTML = newEl.outerHTML
              this.executeScripts(document.querySelector(".javascript-footer"))

              this.onSwitch()
            }
          },*/
          analytics: () => true,
          history: false
        }).loadUrl(
          this.UrlGenerator('claro_resource_open', {
            node: this.step.primaryResource[0].id,
            resourceType: this.step.primaryResource[0].type
          }), {
            analytics: () => true,
            history: false,
            scrollTo: false,
            selectors: [
              "title",
              ".stylesheets",
              ".resource-container",
              ".javascript-footer",
            ]
          }
        )
      }

      // User has access to the current step
      if (!angular.isObject(this.progression)) {
        // Create progression for User
        this.progression = this.userProgressionService.create(this.step, 'seen', true)
      } else {
        // Change the status when the user access the step
        const status = 'unseen' === this.progression.status  ? 'seen' : this.progression.status
        this.userProgressionService.update(this.step, status, true)
      }
    }
  }

  updateProgression(newStatus) {
    this.userProgressionService.update(this.step, newStatus)
  }
}
