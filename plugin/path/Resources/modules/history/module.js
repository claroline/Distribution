/**
 * History module
 */

import angular from 'angular'

import HistoryService from './Service/HistoryService'

angular
  .module('History', [])
  .service('HistoryService', [
    HistoryService
  ])