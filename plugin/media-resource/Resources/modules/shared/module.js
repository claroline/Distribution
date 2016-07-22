/**
 * Shared module
 * Share services and data
 */

import 'angular-sanitize'
import '#/main/core/fos-js-router/module'
import UnsafeFilter from './Filters/UnsafeFilter'
import SecondsToHmsFilter from './Filters/SecondsToHmsFilter'
import ConfigService from './Services/ConfigService'
import RegionsService from './Services/RegionsService'
import UserService from './Services/UserService'

angular
  .module('Shared', [
    'ngSanitize',
    'ui.fos-js-router'
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
  .service('userService', [
    '$http',
    '$q',
    'url',
    UserService
  ])
