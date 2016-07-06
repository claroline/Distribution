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
import 'angular-breadcrumb'
import 'angular-loading-bar'

import '#/main/core/fos-js-router/module'
import '../Cursus/cursus'
import '../Course/course'
import '../Session/session'
import '../SessionEvent/sessionEvent'

import Routing from './routing.js'
import RootCursusManagementCtrl from './Controller/RootCursusManagementCtrl'
import CursusManagementCtrl from './Controller/CursusManagementCtrl'
import CoursesManagementCtrl from './Controller/CoursesManagementCtrl'
import CourseManagementCtrl from './Controller/CourseManagementCtrl'
import SessionsManagementCtrl from './Controller/SessionsManagementCtrl'
import SessionManagementCtrl from './Controller/SessionManagementCtrl'

angular.module('CursusManagementModule', [
  'ui.router',
  'ui.translation',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ngAnimate',
  'ncy-angular-breadcrumb',
  'angular-loading-bar',
  'ngTable',
  'ui.fos-js-router',
  'CursusModule',
  'CourseModule',
  'SessionModule',
  'SessionEventModule'
])
.controller('RootCursusManagementCtrl', ['CursusService', RootCursusManagementCtrl])
.controller('CursusManagementCtrl', ['$stateParams', 'CursusService', CursusManagementCtrl])
.controller('CoursesManagementCtrl', ['NgTableParams', 'CourseService', 'SessionService', CoursesManagementCtrl])
.controller('CourseManagementCtrl', ['$stateParams', 'NgTableParams', 'CourseService', 'SessionService', CourseManagementCtrl])
.controller('SessionsManagementCtrl', ['NgTableParams', 'SessionService', 'SessionEventService', SessionsManagementCtrl])
.controller('SessionManagementCtrl', ['$stateParams', 'NgTableParams', 'SessionService', 'SessionEventService', SessionManagementCtrl])
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