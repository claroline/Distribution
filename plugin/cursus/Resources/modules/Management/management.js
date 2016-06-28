/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'angular/angular.min'

//import '#/main/core/form/module'
import UIRouter from 'angular-ui-router'
import dataTable from 'angular-data-table/release/dataTable.helpers.min'
import bootstrap from 'angular-bootstrap'
import animate from 'angular-animate'
import translation from 'angular-ui-translation/angular-translation'
import breadcrumbs from 'angular-breadcrumb'
import loading from 'angular-loading-bar'

import '#/main/core/fos-js-router/module'
import CursusModule from '../Cursus/cursus'
import CourseModule from '../Course/course'
import SessionModule from '../Session/session'
import SessionEventModule from '../SessionEvent/sessionEvent'

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
  'data-table',
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