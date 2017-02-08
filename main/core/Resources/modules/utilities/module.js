import angular from 'angular'

import IdentifierService from './Service/IdentifierService'
import ArrayService from './Service/ArrayService'

angular
  .module('utilities', [])
  .service('IdentifierService', [
    IdentifierService
  ])
  .service('ArrayService', [
    ArrayService
  ])
