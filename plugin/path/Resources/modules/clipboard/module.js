/**
 * Clipboard module
 */

import angular from 'angular'

import ClipboardService from './Service/ClipboardService'

angular
  .module('Clipboard', [])
  .service('ClipboardService', [
    ClipboardService
  ])