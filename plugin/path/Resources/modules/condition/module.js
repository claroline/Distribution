/**
 * Condition module
 * Manages user access inside the Path
 */

import angular from 'angular/index'

import 'angular-bootstrap'

import '#/main/core/translation/module'
import './../confirm/module'
import './../form/module'
import './../criteria-group/module'

import StepConditionsService from './Service/StepConditionsService'
import ConditionEditCtrl from './Controller/ConditionEditCtrl'
import ConditionEditDirective from './Directive/ConditionEditDirective'

angular
  .module('Condition', [
    'translation',
    'Confirm',
    'Form',
    'CriteriaGroup',
    'ui.bootstrap',
    'ui.bootstrap.tpls'
  ])
  .service('StepConditionsService', [
    '$q',
    'CriteriaGroupService',
    'Translator',
    StepConditionsService
  ])
  .controller('ConditionEditCtrl', [
    'Translator',
    'ConfirmService',
    'StepConditionsService',
    '$uibModal',
    ConditionEditCtrl
  ])
  .directive('conditionEdit', [
    () => new ConditionEditDirective
  ])
  .directive('datetimepickerNeutralTimezone', function () {
    return {
      restrict: 'A',
      priority: 1,
      require: 'ngModel',
      link: (scope, element, attrs, ctrl) => {
        ctrl.$formatters.push((value) => {
          let date = new Date(Date.parse(value))
          date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()))

          return date
        })

        ctrl.$parsers.push((value) => {
          let date = null
          //to allow null value in the picker
          if (value) {
            date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()))
          }
          return date
        })
      }
    }
  })
