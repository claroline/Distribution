/* global Translator */

/**
 * Expose WillDurand JS translator as an angular service
 */

import angular from 'angular'

angular
  .module('translation', [])
  .service('Translator', () => Translator)
