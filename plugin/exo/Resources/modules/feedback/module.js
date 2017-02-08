/**
 * Feedback module
 */

import angular from 'angular'
import FeedbackService from './Services/FeedbackService'

angular
  .module('Feedback', [])
  .service('FeedbackService', [
    '$log',
    FeedbackService
  ])
