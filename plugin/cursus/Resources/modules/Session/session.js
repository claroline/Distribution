/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import angular from 'angular/index'

import 'angular-bootstrap'
import 'angular-bootstrap-colorpicker'
import 'angular-ui-translation/angular-translation'

import SessionService from './Service/SessionService'
import SessionCreationModalCtrl from './Controller/SessionCreationModalCtrl'
import SessionEditionModalCtrl from './Controller/SessionEditionModalCtrl'
import SessionDeletionModalCtrl from './Controller/SessionDeletionModalCtrl'
import UsersRegistrationModalCtrl from './Controller/UsersRegistrationModalCtrl'
import GroupsRegistrationModalCtrl from './Controller/GroupsRegistrationModalCtrl'

angular.module('SessionModule', [
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'colorpicker.module',
  'ui.translation'
])
.service('SessionService', SessionService)
.controller('SessionCreationModalCtrl', SessionCreationModalCtrl)
.controller('SessionEditionModalCtrl', SessionEditionModalCtrl)
.controller('SessionDeletionModalCtrl', SessionDeletionModalCtrl)
.controller('UsersRegistrationModalCtrl', UsersRegistrationModalCtrl)
.controller('GroupsRegistrationModalCtrl', GroupsRegistrationModalCtrl)