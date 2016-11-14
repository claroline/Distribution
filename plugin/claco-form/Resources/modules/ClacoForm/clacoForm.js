/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import angular from 'angular/index'

import 'angular-ui-router'
import 'angular-bootstrap'
import 'angular-animate'
import 'angular-ui-translation/angular-translation'
import 'angular-loading-bar'

import '#/main/core/fos-js-router/module'

import Routing from './routing.js'
import MenuCtrl from './Controller/MenuCtrl'
import GeneralConfigurationCtrl from './Controller/GeneralConfigurationCtrl'
import ClacoFormService from './Service/ClacoFormService'

angular.module('ClacoFormModule', [
  'ui.router',
  'ui.translation',
  'ngAnimate',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'angular-loading-bar',
  'ngTable',
  'ui.fos-js-router'
])
.service('ClacoFormService', ClacoFormService)
.controller('MenuCtrl', ['$state', 'ClacoFormService', MenuCtrl])
.controller('GeneralConfigurationCtrl', ['$state', 'ClacoFormService', GeneralConfigurationCtrl])
.config(Routing)
.config([
  'cfpLoadingBarProvider',
  function configureLoadingBar (cfpLoadingBarProvider) {
    // Configure loader
    cfpLoadingBarProvider.latencyThreshold = 200
    cfpLoadingBarProvider.includeBar = true
    cfpLoadingBarProvider.includeSpinner = true
    //cfpLoadingBarProvider.spinnerTemplate = '<div class="loading">Loading&#8230;</div>';
  }
])