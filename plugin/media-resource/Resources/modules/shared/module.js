/**
 * Shared module
 * Share services and data
 */

import 'angular-sanitize'

import UnsafeFilter from './Filters/UnsafeFilter'
import SecondsToHmsFilter from './Filters/SecondsToHmsFilter'
import ConfigService from './Services/ConfigService'
import RegionsService from './Services/RegionsService'

angular
  .module('Shared', [
      'ngSanitize'
  ])
  .filter('unsafe', [
      '$sce',
      UnsafeFilter
  ])
  .filter('secondsToHms', [
      SecondsToHmsFilter
  ])
  .service('configService', [
      '$filter',
      ConfigService
  ])
  .service('regionsService', [
      RegionsService
  ])
